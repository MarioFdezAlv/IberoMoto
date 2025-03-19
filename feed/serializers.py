# feed/serializers.py (o donde tengas tu PostSerializer)
from django.conf import settings
from django.urls import reverse
from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source="user.username", read_only=True)
    user_profile_image = serializers.SerializerMethodField()  # <--- NUEVO
    video = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "user",
            "user_username",
            "user_profile_image",  # <--- INCLUIR EN LOS CAMPOS
            "content",
            "created_at",
            "image",
            "video",
        ]

    def get_user_profile_image(self, obj):
        """Retorna la URL completa de la foto de perfil del autor del post."""
        if obj.user.profile_image:
            request = self.context.get("request")
            return (
                request.build_absolute_uri(obj.user.profile_image.url)
                if request
                else obj.user.profile_image.url
            )
        return None

    def get_video(self, obj):
        if obj.video:
            request = self.context.get("request")
            relative_path = obj.video.url.replace(settings.MEDIA_URL, "")
            video_url = reverse("stream_video", kwargs={"path": relative_path})
            return request.build_absolute_uri(video_url) if request else video_url
        return None
