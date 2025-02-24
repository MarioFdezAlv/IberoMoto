from django.db import models
from accounts.models import CustomUser

class Garage(models.Model):
    owner = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='garage')

class Motorcycle(models.Model):
    garage = models.ForeignKey(Garage, on_delete=models.CASCADE, related_name='motorcycles')
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()