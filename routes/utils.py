import requests
from django.contrib.gis.geos import LineString


def snap_to_road_osrm_public(points):
    """
    Usa el servicio público de OSRM (router.project-osrm.org) para hacer map matching.
    Los puntos deben estar en formato [lon, lat]. Se utiliza un radio de búsqueda de 100 metros
    para cada punto (ajusta según necesites).
    """
    if not points:
        return None

    radius = 100  # radio en metros
    # Construye la cadena de coordenadas: "lon,lat;lon,lat;..."
    coords_str = ";".join(f"{lon},{lat}" for lon, lat in points)
    # Crea el parámetro "radiuses" con 100 metros para cada punto
    radiuses = ";".join(str(radius) for _ in points)

    url = (
        f"https://router.project-osrm.org/match/v1/driving/{coords_str}"
        f"?geometries=geojson&overview=full&radiuses={radiuses}"
    )

    try:
        response = requests.get(url)
        data = response.json()
        print("OSRM response:", data)  # Para depurar
    except Exception as e:
        print("Error al llamar a OSRM:", e)
        return None

    if "matchings" not in data or not data["matchings"]:
        print("OSRM error:", data)
        return None

    geometry = data["matchings"][0]["geometry"]
    coords = geometry["coordinates"]
    return LineString(coords, srid=4326)
