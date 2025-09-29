"""
URLs for groups app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
# TODO: Add group viewsets when models are created

urlpatterns = [
    path('', include(router.urls)),
]