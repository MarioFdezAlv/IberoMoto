# serializers.py
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers
from .models import Route


class RouteSerializer(GeoFeatureModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = Route
        geo_field = "geometry"
        fields = ("id", "name", "description", "user")
