from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

# Verifica si el modelo ya está registrado antes de registrarlo
if not admin.site.is_registered(CustomUser):

    @admin.register(CustomUser)
    class CustomUserAdmin(UserAdmin):
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
