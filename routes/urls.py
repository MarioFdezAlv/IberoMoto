# routes/urls.py
from django.urls import path, include
from rest_framework import routers
from .views import RouteViewSet

router = routers.DefaultRouter()
router.register(r"routes", RouteViewSet, basename="route")

urlpatterns = [
    path("", include(router.urls)),
]
