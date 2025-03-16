from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomUserManager


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    profile_image = models.ImageField(
        upload_to="profile_images/", null=True, blank=True
    )

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    objects = CustomUserManager()

    def __str__(self):
        return self.username


from django.contrib import admin
from .models import CustomUser


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "profile_image")
    fieldsets = (
        (None, {"fields": ("username", "email", "password", "profile_image")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "email",
                    "password1",
                    "password2",
                    "profile_image",
                ),
            },
        ),
    )


admin.site.register(CustomUser, CustomUserAdmin)
