from django.db import models
from accounts.models import CustomUser

class Route(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='routes')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    start_location = models.CharField(max_length=255)
    end_location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)