from rest_framework import serializers
from django.conf import settings
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source="user.username", read_only=True)
    video = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "user",
            "user_username",
            "content",
            "created_at",
            "image",
            "video",
        ]

    def get_video(self, obj):
        """
        Genera la URL completa del video.
        """
        if obj.video:
            request = self.context.get("request")
            video_url = obj.video.url  # Esto da la URL relativa

            # Devuelve la URL completa dependiendo de si hay request
            if request:
                return request.build_absolute_uri(video_url)
            return f"{settings.MEDIA_URL}{video_url}"  # Devuelve la URL completa si no hay request

        return None
