from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, UserPostsViewSet, stream_video

router = DefaultRouter()
router.register(r"posts", PostViewSet, basename="posts")

urlpatterns = [
    path("", include(router.urls)),
    path("videos/<path:path>/", stream_video, name="stream_video"),
    path("user/posts/", UserPostsViewSet.as_view({"get": "list"}), name="user-posts"),
]
