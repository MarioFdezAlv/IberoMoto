# models.py
from django.contrib.gis.db import models
from accounts.models import CustomUser  # Asegúrate de que este sea tu modelo de usuario


class Route(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="routes"
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    start_location = models.CharField(max_length=255, blank=True, null=True)
    end_location = models.CharField(max_length=255, blank=True, null=True)
    geometry = models.LineStringField(srid=4326, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Si se requiere, puedes ajustar start_location y end_location según la geometría.
        if self.geometry:
            # Aquí podrías obtener el primer y último punto para almacenarlos como Point
            self.start_location = str(self.geometry[0])
            self.end_location = str(self.geometry[-1])
        super().save(*args, **kwargs)
