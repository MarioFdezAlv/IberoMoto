from django.contrib import admin
from django.contrib.gis.forms import OSMWidget
from django import forms
from .models import Route
from .utils import snap_to_road_osrm_public  # Importa la función de snapping


class RouteForm(forms.ModelForm):
    class Meta:
        model = Route
        fields = "__all__"
        widgets = {"geometry": OSMWidget(attrs={"map_width": 800, "map_height": 500})}


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    form = RouteForm
    list_display = ("name", "description")

    def save_model(self, request, obj, form, change):
        """
        Al guardar una ruta desde el admin, se extraen las coordenadas
        de la geometría dibujada y se aplica el snapping mediante OSRM.
        """
        if obj.geometry:
            try:
                # Suponemos que obj.geometry es un LineString con coordenadas (lon, lat)
                points = list(obj.geometry.coords)
                snapped_geom = snap_to_road_osrm_public(points)
                if snapped_geom:
                    obj.geometry = snapped_geom
                else:
                    self.message_user(
                        request,
                        "No se pudo adaptar la ruta a la carretera. Se guardará la geometría original.",
                    )
            except Exception as e:
                self.message_user(request, f"Error al aplicar snapping: {e}")
        super().save_model(request, obj, form, change)
