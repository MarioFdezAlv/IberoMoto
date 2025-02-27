import traceback
from django.http import JsonResponse
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model  # Importar el modelo de usuario correcto
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import Group

User = get_user_model()  # Ahora apunta a CustomUser


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            username = request.data.get("username")
            password = request.data.get("password")
            email = request.data.get("email")

            if not username or not password:
                return Response(
                    {"error": "Username and password are required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if User.objects.filter(username=username).exists():
                return Response(
                    {"error": "Username already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = User.objects.create_user(
                username=username, email=email, password=password
            )

            group = Group.objects.get(name="Usuarios")
            user.groups.add(group)

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "User registered successfully",
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            traceback.print_exc()  # Imprime el error en la terminal
            return JsonResponse({"error": str(e)}, status=500)


User = get_user_model()


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Retorna el perfil del usuario autenticado.
        Se asume que usas SimpleJWT y ya estás enviando un token válido en el header.
        """
        user = request.user  # usuario autenticado a partir del token
        # Devuelve los datos que quieras, por ejemplo:
        data = {
            "username": user.username,
            "email": user.email,
            "image": None,  # si tu modelo tiene un campo image, p.e. user.profile_image.url
        }
        return Response(data, status=status.HTTP_200_OK)
