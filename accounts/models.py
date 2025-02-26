# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomUserManager


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)

    # Se hereda 'password' de AbstractUser, no hace falta declararlo
    # sino que ya existe el campo password en AbstractUser
    # pero lo has puesto en tu snippet, no pasa nada,
    # lo importante es que set_password se llame al crearlo

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    # Usamos el manager personalizado
    objects = CustomUserManager()

    def __str__(self):
        return self.username
