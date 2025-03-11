from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import Route


class RouteSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Route
        geo_field = "geometry"
        fields = ("id", "name", "description")
