# accounts/managers.py
from django.contrib.auth.base_user import BaseUserManager


class CustomUserManager(BaseUserManager):
    """Manager personalizado para crear usuarios con contraseñas encriptadas."""

    def create_user(self, username, email, password=None, **extra_fields):
        if not username:
            raise ValueError('El campo "username" no puede estar vacío.')
        if not email:
            raise ValueError('El campo "email" no puede estar vacío.')

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)

        # IMPORTANTE: encripta la contraseña correctamente
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser debe tener is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser debe tener is_superuser=True.")

        return self.create_user(username, email, password, **extra_fields)
