from django.db import models
from accounts.models import CustomUser

class Store(models.Model):
    owner = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='store')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

class Merchandise(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    photos = models.ImageField(upload_to='merchandise/products/')