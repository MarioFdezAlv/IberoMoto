# routes/views.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

# Importa tu renderer personalizado:
from .renderers import CustomGeoJSONRenderer

from .models import Route
from .serializers import RouteSerializer


class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    permission_classes = [AllowAny]

    # Renderers que usará esta vista:
    renderer_classes = [CustomGeoJSONRenderer]
