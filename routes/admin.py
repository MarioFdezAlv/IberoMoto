from django.contrib import admin
from django.contrib.gis.forms import OSMWidget
from django import forms
from .models import Route


class RouteForm(forms.ModelForm):
    class Meta:
        model = Route
        fields = "__all__"
        widgets = {"geometry": OSMWidget(attrs={"map_width": 800, "map_height": 500})}


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    form = RouteForm
    list_display = ("name", "description")
