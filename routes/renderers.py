# routes/renderers.py
from rest_framework.renderers import JSONRenderer


class CustomGeoJSONRenderer(JSONRenderer):
    """
    Renderer personalizado para devolver datos en formato GeoJSON.
    """

    media_type = "application/geo+json"
    format = "geojson"

    def render(self, data, accepted_media_type=None, renderer_context=None):
        """
        Si lo deseas, aquí puedes personalizar la estructura para cumplir con
        la especificación GeoJSON. Por ejemplo, envolver 'data' en un objeto
        con 'type': 'FeatureCollection', etc.
        """
        # Ejemplo muy simplificado que asume que 'data' ya está en el formato de GeoJSON
        return super().render(data, accepted_media_type, renderer_context)
