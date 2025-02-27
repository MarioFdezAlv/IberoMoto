from django.db import models
from django.conf import settings
from accounts.models import CustomUser
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys


class Post(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    # Campo para imagen (opcional)
    image = models.ImageField(upload_to="posts/images/", blank=True, null=True)
    # Campo para video (opcional)
    video = models.FileField(upload_to="posts/videos/", blank=True, null=True)

    def __str__(self):
        return f"Post de {self.user.username} - {self.created_at}"

    def save(self, *args, **kwargs):
        """
        Sobrescribimos el método save para comprimir la imagen en caso de que exista.
        """
        super().save(*args, **kwargs)

        if self.image:
            self.compress_image()

    def compress_image(self):
        """
        Usamos Pillow para ajustar la calidad de la imagen y guardarla nuevamente.
        """
        # Abrimos la imagen que ya se ha guardado en disco
        img = Image.open(self.image.path)

        # Convertimos a RGB si está en modo "P", "RGBA", etc.
        if img.mode not in ("L", "RGB"):
            img = img.convert("RGB")

        # Creamos un buffer para re-guardar la imagen
        img_io = BytesIO()
        # Ajusta 'quality' según sea necesario (ej: 70)
        img.save(img_io, format="JPEG", quality=70)
        img_io.seek(0)

        # Reemplazamos el archivo original
        self.image.save(
            self.image.name,
            InMemoryUploadedFile(
                img_io,  # bytes
                "ImageField",  # campo
                f"{self.image.name.split('.')[0]}.jpg",
                "image/jpeg",
                sys.getsizeof(img_io),
                None,
            ),
            save=False,
        )

        # Guardamos sin llamar de nuevo a super().save() para evitar loop
        super(Post, self).save(update_fields=["image"])


class Story(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="stories"
    )
    image = models.ImageField(upload_to="stories/")
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
