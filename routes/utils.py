# utils.py
import requests
from math import floor
from django.conf import settings
from django.contrib.gis.geos import LineString


def reduce_points(points, max_points=200):
    """
    Reduce una lista de puntos [(lon, lat), ...] a un máximo de `max_points`
    tomando muestras uniformemente.
    Se aumenta el límite a 200 para conservar más detalle.
    """
    n = len(points)
    if n <= max_points:
        return points
    step = n / max_points
    reduced = [points[floor(i * step)] for i in range(max_points)]
    if reduced[-1] != points[-1]:
        reduced[-1] = points[-1]
    return reduced


def snap_to_road_mapbox(points):
    """
    Llama a la API de Map Matching de Mapbox para encajar los puntos sobre la red vial.
    'points' es una lista de (lon, lat).
    Devuelve un LineString o None en caso de error.

    Se fuerza que el primer y último punto se encajen con una tolerancia muy baja (radiuses=5)
    y se deja mayor tolerancia para los puntos intermedios (radiuses=300),
    además de especificar "approaches" para que los extremos se fijen en la acera (curb).
    """
    if not points:
        return None

    # Reducir puntos para evitar URL excesivamente largas, conservando detalle.
    reduced_points = reduce_points(points, max_points=200)
    coords_str = ";".join(f"{lon},{lat}" for lon, lat in reduced_points)
    n = len(reduced_points)

    # Definir approaches: endpoints forzados a "curb" y el resto sin restricción.
    if n == 1:
        approaches = "curb"
    else:
        approaches_list = []
        for i in range(n):
            if i == 0 or i == n - 1:
                approaches_list.append("curb")
            else:
                approaches_list.append("unrestricted")
        approaches = ";".join(approaches_list)

    # Definir radiuses: endpoints muy precisos (5m) y los intermedios 300m.
    if n == 1:
        radiuses = "5"
    else:
        radiuses_list = []
        for i in range(n):
            if i == 0 or i == n - 1:
                radiuses_list.append("5")
            else:
                radiuses_list.append("300")
        radiuses = ";".join(radiuses_list)

    # Construir la URL con tidy=false para evitar simplificaciones excesivas.
    url = (
        f"https://api.mapbox.com/matching/v5/mapbox/driving/{coords_str}"
        f"?access_token={settings.MAPBOX_ACCESS_TOKEN}"
        f"&geometries=geojson&overview=full&tidy=false"
        f"&approaches={approaches}"
        f"&radiuses={radiuses}"
    )

    try:
        response = requests.get(url)
        print("Mapbox status code:", response.status_code)
        print("Mapbox raw text:", response.text[:200])
        data = response.json()
    except Exception as e:
        print("Error al llamar a Mapbox:", e)
        return None

    if "matchings" not in data or not data["matchings"]:
        print("Mapbox error:", data)
        return None

    geometry = data["matchings"][0]["geometry"]
    coords = geometry["coordinates"]
    return LineString(coords, srid=4326)
