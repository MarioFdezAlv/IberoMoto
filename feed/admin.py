from django.contrib import admin
from .models import Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at")
    search_fields = ("user__username", "content")


# @admin.register(Story)
# class StoryAdmin(admin.ModelAdmin):
#    list_display = ("id", "user", "created_at", "expires_at")
#    search_fields = ("user__username",)
