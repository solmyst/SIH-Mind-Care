"""
URLs for journals app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'entries', views.JournalViewSet, basename='journal-entries')
router.register(r'prompts', views.JournalPromptViewSet, basename='journal-prompts')
router.register(r'reminders', views.JournalReminderViewSet, basename='journal-reminders')

urlpatterns = [
    # Analytics endpoints
    path('emotion-frequency/', views.emotion_frequency, name='emotion-frequency'),
    path('counsellor/shared/', views.counsellor_shared_journals, name='counsellor-shared-journals'),
    path('generate-insights/', views.generate_insights, name='generate-insights'),
    
    # Router URLs
    path('', include(router.urls)),
]