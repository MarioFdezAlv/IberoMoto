from rest_framework import viewsets, permissions
from django.http import StreamingHttpResponse, FileResponse, HttpResponse
import os
from django.conf import settings
from .models import Post
from .serializers import PostSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by("-created_at")
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


def stream_video(request, path):
    """
    Vista para manejar Range Requests en la carga de videos.
    """
    file_path = os.path.join(
        settings.MEDIA_ROOT, path.lstrip("/")
    )  # 🔹 Corrige la ruta eliminando la barra inicial

    if not os.path.exists(file_path):
        return HttpResponse(status=404)

    file_size = os.path.getsize(file_path)
    content_type = "video/mp4"

    range_header = request.headers.get("Range", None)
    if range_header:
        try:
            range_value = range_header.strip().split("=")[-1]
            start, end = range_value.split("-")

            start = int(start) if start else 0
            end = int(end) if end else file_size - 1
            end = min(end, file_size - 1)

            length = end - start + 1

            response = HttpResponse(content_type=content_type, status=206)
            response["Content-Range"] = f"bytes {start}-{end}/{file_size}"
            response["Accept-Ranges"] = "bytes"
            response["Content-Length"] = str(length)
            response["Content-Disposition"] = (
                f'inline; filename="{os.path.basename(file_path)}"'
            )

            with open(file_path, "rb") as f:
                f.seek(start)
                response.write(f.read(length))

            return response
        except Exception as e:
            print(f"Error en Range Request: {e}")
            return HttpResponse(status=500)

    response = FileResponse(open(file_path, "rb"), content_type=content_type)
    response["Accept-Ranges"] = "bytes"
    response["Content-Length"] = str(file_size)
    response["Content-Disposition"] = (
        f'inline; filename="{os.path.basename(file_path)}"'
    )
    return response
