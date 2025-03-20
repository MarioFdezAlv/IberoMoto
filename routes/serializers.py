# serializers.py
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers
from .models import Route


class RouteSerializer(GeoFeatureModelSerializer):
    # Lectura de solo el nombre de usuario
    user = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = Route
        geo_field = "geometry"  # Campo que contiene la geometría
        fields = ("id", "name", "description", "user")  # <--- incluimos user
