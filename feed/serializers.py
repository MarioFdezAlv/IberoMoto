from rest_framework import serializers
from django.conf import settings
from .models import Post
from django.urls import reverse


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
        if obj.video:
            request = self.context.get("request")
            # Remover el prefijo MEDIA_URL para obtener la ruta relativa correcta
            relative_path = obj.video.url.replace(settings.MEDIA_URL, "")
            video_url = reverse("stream_video", kwargs={"path": relative_path})
            return request.build_absolute_uri(video_url) if request else video_url
        return None
