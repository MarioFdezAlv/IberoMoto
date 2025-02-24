from django.db import models
from accounts.models import CustomUser

class MarketplaceMotorcycle(models.Model):
    seller = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='marketplace_motorcycles')
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    power = models.CharField(max_length=50)
    kilometers = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    photos = models.ImageField(upload_to='marketplace/motorcycles/')