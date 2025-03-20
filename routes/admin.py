# admin.py
from django.contrib import admin
from django.contrib.gis.forms import OSMWidget
from django import forms
from .models import Route
from .utils import snap_to_road_mapbox


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
        Al guardar una ruta en el admin, se extraen las coordenadas de la geometría
        y se aplica el map matching mediante la API de Mapbox.
        """
        if obj.geometry:
            try:
                points = list(obj.geometry.coords)
                snapped_geom = snap_to_road_mapbox(points)
                if snapped_geom:
                    obj.geometry = snapped_geom
                else:
                    self.message_user(
                        request,
                        "No se pudo adaptar la ruta con Mapbox. Se guardará la geometría original.",
                        level="warning",
                    )
            except Exception as e:
                self.message_user(
                    request, f"Error al aplicar snapping: {e}", level="error"
                )
        super().save_model(request, obj, form, change)
