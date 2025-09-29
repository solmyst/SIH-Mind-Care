"""
URLs for chat app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'sessions', views.ChatSessionViewSet, basename='chat-sessions')
router.register(r'templates', views.ChatTemplateViewSet, basename='chat-templates')

urlpatterns = [
    # Analytics and stats
    path('stats/', views.chat_stats, name='chat-stats'),
    path('counsellor/queue/', views.counsellor_queue, name='counsellor-queue'),
    
    # Router URLs
    path('', include(router.urls)),
]