from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RouteViewSet, UserRoutesViewSet

router = DefaultRouter()
router.register(r"routes", RouteViewSet, basename="route")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "user/routes/", UserRoutesViewSet.as_view({"get": "list"}), name="user-routes"
    ),
]
