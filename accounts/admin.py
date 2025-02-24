from django.contrib import admin
from .models import CustomUser

# Registra los modelos en el panel de administración
admin.site.register(CustomUser)

