"""
URLs for users app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.UserViewSet, basename='users')
router.register(r'sessions', views.UserSessionViewSet, basename='user-sessions')

urlpatterns = [
    # Profile management
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('profile/update/', views.UserProfileUpdateView.as_view(), name='user-profile-update'),
    
    # Utility endpoints
    path('update-activity/', views.update_last_active, name='update-last-active'),
    path('stats/', views.user_stats, name='user-stats'),
    path('search/', views.search_users, name='search-users'),
    
    # Router URLs
    path('', include(router.urls)),
]