"""
URLs for counselling app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
# TODO: Add counselling viewsets when models are created

urlpatterns = [
    path('', include(router.urls)),
]