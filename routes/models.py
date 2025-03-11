from django.contrib.gis.db import models  # 👈 Importante
from accounts.models import CustomUser
from django.contrib.gis.geos import Point  # Si usas Point en save()


class Route(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="routes"
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    start_location = models.CharField(max_length=255, blank=True, null=True)
    end_location = models.CharField(max_length=255, blank=True, null=True)
    geometry = models.LineStringField(srid=4326, null=False)  # asegurar no null

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.geometry:
            self.start_location = Point(self.geometry[0])
            self.end_location = Point(self.geometry[-1])
        super().save(*args, **kwargs)
