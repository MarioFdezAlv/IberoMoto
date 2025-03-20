# views.py
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Route
from .serializers import RouteSerializer
from .renderers import (
    CustomGeoJSONRenderer,
)  # Asegúrate de tener este renderer configurado
from .utils import snap_to_road_mapbox


class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    permission_classes = [AllowAny]  # O ajusta según tu lógica de permisos
    renderer_classes = [CustomGeoJSONRenderer]

    def create(self, request, *args, **kwargs):
        """
        Espera un JSON como:
        {
            "name": "Mi ruta",
            "description": "Probando snapping con Mapbox",
            "points": [[-3.7038, 40.4168], [-3.7045, 40.4170], ...]
        }
        Donde 'points' es una lista de [lon, lat].
        """
        points = request.data.get("points")
        if not points or not isinstance(points, list):
            return Response(
                {"error": "No points provided or invalid format"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        snapped_geom = snap_to_road_mapbox(points)
        if not snapped_geom:
            return Response(
                {"error": "No se pudo snapear la ruta con Mapbox."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = {
            "name": request.data.get("name"),
            "description": request.data.get("description"),
            "geometry": snapped_geom,
        }

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

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
            snapped_geom = snap_to_road_mapbox(points)
            if not snapped_geom:
                return Response(
                    {"error": "No se pudo snapear la ruta"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            route.geometry = snapped_geom

        route.name = name
        route.description = description
        route.save()

        serializer = self.get_serializer(route)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        """
        Permite actualizar parcialmente una ruta existente. Si se envía "points" en el body,
        se vuelve a aplicar el snapping para adaptar la ruta a la carretera.
        """
        route = self.get_object()
        # Solo actualizamos los campos que vengan en el request
        if "points" in request.data and isinstance(request.data.get("points"), list):
            snapped_geom = snap_to_road_mapbox(request.data.get("points"))
            if not snapped_geom:
                return Response(
                    {"error": "No se pudo snapear la ruta"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            route.geometry = snapped_geom

        if "name" in request.data:
            route.name = request.data.get("name")
        if "description" in request.data:
            route.description = request.data.get("description")

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
