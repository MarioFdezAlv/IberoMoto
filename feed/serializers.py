# serializers.py
from rest_framework import serializers
from .models import Post
from accounts.models import CustomUser


class PostSerializer(serializers.ModelSerializer):
    # Con esta línea tomas el valor 'username' del campo user
    user_username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "user",  # esto seguirá devolviendo el id del usuario
            "user_username",  # este nuevo campo mostrará el nombre del usuario
            "content",
            "created_at",
            "image",
            "video",
        ]
