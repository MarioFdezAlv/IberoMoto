from rest_framework import viewsets, status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Route
from .serializers import RouteSerializer
from .renderers import (
    CustomGeoJSONRenderer,
)  # Asegúrate de tener este renderer configurado
from .utils import snap_to_road_osrm_public


class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    permission_classes = [AllowAny]
    renderer_classes = [CustomGeoJSONRenderer]

    def create(self, request, *args, **kwargs):
        """
        Espera un JSON como:
        {
          "name": "Mi ruta",
          "description": "Probando snapping",
          "points": [[-3.7038, 40.4168], [-3.7045, 40.4170], ...]
        }
        """
        name = request.data.get("name")
        description = request.data.get("description")
        points = request.data.get("points")  # debe ser un array de [lon, lat]

        if not points or not isinstance(points, list):
            return Response(
                {"error": "No points provided or invalid format"}, status=400
            )

        snapped_geom = snap_to_road_osrm_public(points)
        if not snapped_geom:
            return Response({"error": "No se pudo snapear la ruta"}, status=400)

        route = Route.objects.create(
            name=name,
            description=description,
            geometry=snapped_geom,  # La geometría procesada por OSRM
        )

        serializer = self.get_serializer(route)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Permite actualizar una ruta existente. Si se envía "points" en el body,
        se vuelve a aplicar el snapping para adaptar la ruta a la carretera.
        """
        route = self.get_object()
        name = request.data.get("name", route.name)
        description = request.data.get("description", route.description)
        points = request.data.get("points")  # opcional

        if points and isinstance(points, list):
            snapped_geom = snap_to_road_osrm_public(points)
            if not snapped_geom:
                return Response({"error": "No se pudo snapear la ruta"}, status=400)
            route.geometry = snapped_geom

        route.name = name
        route.description = description
        route.save()

        serializer = self.get_serializer(route)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        """
        Similar a update, pero para actualizaciones parciales.
        """
        route = self.get_object()
        name = request.data.get("name", route.name)
        description = request.data.get("description", route.description)
        points = request.data.get("points")  # opcional

        if points and isinstance(points, list):
            snapped_geom = snap_to_road_osrm_public(points)
            if not snapped_geom:
                return Response({"error": "No se pudo snapear la ruta"}, status=400)
            route.geometry = snapped_geom

        route.name = name
        route.description = description
        route.save()

        serializer = self.get_serializer(route)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserRoutesViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RouteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print(
            f"👤 Usuario autenticado: {self.request.user}"
        )  # 🔍 Verificar usuario autenticado
        return Route.objects.filter(user=self.request.user).order_by("-created_at")
