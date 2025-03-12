# models.py
from django.db import models
from django.conf import settings
from accounts.models import CustomUser
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys
import os
import ffmpeg  # Si usas la librería ffmpeg-python
from django.core.files import File


class Post(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    image = models.ImageField(upload_to="posts/images/", blank=True, null=True)
    video = models.FileField(upload_to="posts/videos/", blank=True, null=True)

    def __str__(self):
        return f"Post de {self.user.username} - {self.created_at}"

    def save(self, *args, **kwargs):
        """
        Sobrescribimos el método save para comprimir la imagen (si existe)
        y transcodificar el video (si existe).
        """
        super().save(*args, **kwargs)

        # Comprimir imagen si existe
        if self.image:
            self.compress_image()

        # Transcodificar video si existe
        if self.video:
            self.compress_video()

    def compress_image(self):
        """
        Usamos Pillow para ajustar la calidad de la imagen y guardarla nuevamente.
        """
        img = Image.open(self.image.path)

        if img.mode not in ("L", "RGB"):
            img = img.convert("RGB")

        img_io = BytesIO()
        img.save(img_io, format="JPEG", quality=70)
        img_io.seek(0)

        self.image.save(
            self.image.name,
            InMemoryUploadedFile(
                img_io,
                "ImageField",
                f"{self.image.name.split('.')[0]}.jpg",
                "image/jpeg",
                sys.getsizeof(img_io),
                None,
            ),
            save=False,
        )
        super(Post, self).save(update_fields=["image"])

    def compress_video(self):
        """
        Con FFmpeg, convertimos el video a formato MP4 (H.264 / AAC) para que sea ampliamente soportado.
        """
        import ffmpeg
        import os
        import sys
        from django.core.files import File

        input_path = self.video.path

        # Tomamos SOLO el nombre del archivo
        base_name = os.path.splitext(os.path.basename(input_path))[0]
        output_filename = f"{base_name}_processed.mp4"

        # Directorio donde se guardará el nuevo video
        output_dir = os.path.dirname(input_path)
        output_path = os.path.join(output_dir, output_filename)

        try:
            (
                ffmpeg.input(input_path)
                .output(
                    output_path,
                    format="mp4",
                    vcodec="libx264",
                    acodec="aac",
                    strict="experimental",
                    crf=28,
                    preset="fast",
                )
                .run(overwrite_output=True)
            )
        except ffmpeg.Error as e:
            print("Error en FFmpeg:", e)
            return

        # Borramos el original y asignamos el nuevo al campo 'video'
        self.video.delete(save=False)  # elimina el archivo anterior
        with open(output_path, "rb") as f:
            self.video.save(output_filename, File(f), save=False)

        super(Post, self).save(update_fields=["video"])
