"""
Views for journal entries and analytics.
"""

from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from django.db.models import Q, Avg, Count
from django.utils import timezone
from datetime import datetime, timedelta
import random

from users.permissions import IsOwnerOrReadOnly, IsCounsellorOrAdmin
from .models import Journal, JournalPrompt, JournalAnalytics, JournalReminder
from .serializers import (
    JournalSerializer, JournalCreateSerializer, JournalUpdateSerializer,
    JournalSummarySerializer, JournalPromptSerializer, JournalAnalyticsSerializer,
    JournalReminderSerializer, JournalStatsSerializer, MoodTrendSerializer,
    EmotionFrequencySerializer, JournalSearchSerializer
)
from .tasks import process_journal_entry, generate_journal_insights


class JournalViewSet(ModelViewSet):
    """
    ViewSet for managing journal entries.
    """
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        """Return journals for current user only."""
        return Journal.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        """Use different serializers based on action."""
        if self.action == 'create':
            return JournalCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return JournalUpdateSerializer
        elif self.action == 'list':
            return JournalSummarySerializer
        return JournalSerializer
    
    def perform_create(self, serializer):
        """Create journal entry and trigger background processing."""
        journal = serializer.save(user=self.request.user)
        
        # Trigger background tasks for AI processing
        process_journal_entry.delay(journal.id)
    
    def perform_update(self, serializer):
        """Update journal entry and reprocess if content changed."""
        old_content = serializer.instance.content
        journal = serializer.save()
        
        # Reprocess if content changed significantly
        if journal.content != old_content:
            process_journal_entry.delay(journal.id)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get journal statistics for current user."""
        user = request.user
        now = timezone.now()
        
        # Basic counts
        total_entries = Journal.objects.filter(user=user).count()
        this_month = Journal.objects.filter(
            user=user,
            created_at__gte=now.replace(day=1)
        ).count()
        this_week = Journal.objects.filter(
            user=user,
            created_at__gte=now - timedelta(days=7)
        ).count()
        
        # Mood statistics
        mood_stats = Journal.objects.filter(user=user).aggregate(
            avg_mood=Avg('mood_level')
        )
        
        # Calculate streaks and trends
        recent_entries = Journal.objects.filter(
            user=user,
            created_at__gte=now - timedelta(days=30)
        ).order_by('-created_at')
        
        # Risk alerts
        risk_alerts = Journal.objects.filter(
            user=user,
            risk_level__in=['high', 'critical'],
            created_at__gte=now - timedelta(days=30)
        ).count()
        
        # Most used emotions
        all_emotions = []
        for entry in Journal.objects.filter(user=user):
            all_emotions.extend(entry.emotions)
        
        emotion_counts = {}
        for emotion in all_emotions:
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
        
        most_used_emotions = sorted(
            emotion_counts.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:5]
        
        stats_data = {
            'total_entries': total_entries,
            'this_month_entries': this_month,
            'this_week_entries': this_week,
            'average_mood': mood_stats['avg_mood'] or 0,
            'mood_trend': 'stable',  # TODO: Calculate actual trend
            'longest_streak': 0,  # TODO: Calculate streaks
            'current_streak': 0,
            'most_used_emotions': [emotion[0] for emotion in most_used_emotions],
            'risk_alerts': risk_alerts,
            'total_words': sum(entry.word_count for entry in recent_entries)
        }
        
        serializer = JournalStatsSerializer(stats_data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def mood_trend(self, request):
        """Get mood trend data for charts."""
        user = request.user
        days = int(request.GET.get('days', 30))
        
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        # Get daily mood averages
        daily_moods = {}
        journals = Journal.objects.filter(
            user=user,
            created_at__date__gte=start_date,
            created_at__date__lte=end_date
        )
        
        for journal in journals:
            date = journal.created_at.date()
            if date not in daily_moods:
                daily_moods[date] = []
            daily_moods[date].append(journal.mood_level)
        
        # Calculate averages and create trend data
        trend_data = []
        current_date = start_date
        while current_date <= end_date:
            if current_date in daily_moods:
                avg_mood = sum(daily_moods[current_date]) / len(daily_moods[current_date])
                entry_count = len(daily_moods[current_date])
            else:
                avg_mood = 0
                entry_count = 0
            
            trend_data.append({
                'date': current_date,
                'mood_level': avg_mood,
                'entry_count': entry_count
            })
            current_date += timedelta(days=1)
        
        serializer = MoodTrendSerializer(trend_data, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def search(self, request):
        """Search journal entries with filters."""
        search_serializer = JournalSearchSerializer(data=request.data)
        if not search_serializer.is_valid():
            return Response(search_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = search_serializer.validated_data
        queryset = Journal.objects.filter(user=request.user)
        
        # Apply filters
        if data.get('query'):
            queryset = queryset.filter(
                Q(content__icontains=data['query']) |
                Q(title__icontains=data['query']) |
                Q(voice_transcription__icontains=data['query'])
            )
        
        if data.get('mood_level'):
            queryset = queryset.filter(mood_level=data['mood_level'])
        
        if data.get('tags'):
            for tag in data['tags']:
                queryset = queryset.filter(tags__contains=tag)
        
        if data.get('start_date'):
            queryset = queryset.filter(created_at__date__gte=data['start_date'])
        
        if data.get('end_date'):
            queryset = queryset.filter(created_at__date__lte=data['end_date'])
        
        if data.get('risk_level'):
            queryset = queryset.filter(risk_level=data['risk_level'])
        
        if data.get('entry_type'):
            queryset = queryset.filter(entry_type=data['entry_type'])
        
        # Order by relevance (for now, just by date)
        queryset = queryset.order_by('-created_at')
        
        # Paginate results
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = JournalSummarySerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = JournalSummarySerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def share_with_counsellor(self, request, pk=None):
        """Share journal entry with counsellor."""
        journal = self.get_object()
        journal.shared_with_counsellor = True
        journal.save()
        
        return Response({'message': 'Journal entry shared with counsellor'})
    
    @action(detail=True, methods=['post'])
    def unshare(self, request, pk=None):
        """Unshare journal entry from counsellor."""
        journal = self.get_object()
        journal.shared_with_counsellor = False
        journal.save()
        
        return Response({'message': 'Journal entry unshared'})


class JournalPromptViewSet(ModelViewSet):
    """
    ViewSet for journal prompts.
    """
    queryset = JournalPrompt.objects.filter(is_active=True)
    serializer_class = JournalPromptSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """Only allow reading for regular users."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsCounsellorOrAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'])
    def random(self, request):
        """Get random prompts based on user's recent mood."""
        user = request.user
        
        # Get user's recent mood levels
        recent_moods = Journal.objects.filter(
            user=user,
            created_at__gte=timezone.now() - timedelta(days=7)
        ).values_list('mood_level', flat=True)
        
        if recent_moods:
            avg_mood = sum(recent_moods) / len(recent_moods)
        else:
            avg_mood = 3  # Default to neutral
        
        # Get suitable prompts
        suitable_prompts = JournalPrompt.objects.filter(is_active=True)
        
        # Filter by mood if prompts have mood targeting
        mood_targeted_prompts = suitable_prompts.filter(
            target_mood_levels__contains=[int(avg_mood)]
        )
        
        if mood_targeted_prompts.exists():
            prompts = mood_targeted_prompts
        else:
            prompts = suitable_prompts
        
        # Get random prompts
        count = min(3, prompts.count())
        random_prompts = random.sample(list(prompts), count)
        
        serializer = JournalPromptSerializer(random_prompts, many=True)
        return Response(serializer.data)


class JournalReminderViewSet(ModelViewSet):
    """
    ViewSet for managing journal reminders.
    """
    serializer_class = JournalReminderSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        """Return reminders for current user only."""
        return JournalReminder.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Create reminder for current user."""
        serializer.save(user=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def emotion_frequency(request):
    """Get emotion frequency data for current user."""
    user = request.user
    days = int(request.GET.get('days', 30))
    
    end_date = timezone.now()
    start_date = end_date - timedelta(days=days)
    
    journals = Journal.objects.filter(
        user=user,
        created_at__gte=start_date
    )
    
    # Count emotions
    emotion_counts = {}
    total_emotions = 0
    
    for journal in journals:
        for emotion in journal.emotions:
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
            total_emotions += 1
    
    # Calculate percentages
    emotion_data = []
    for emotion, count in emotion_counts.items():
        percentage = (count / total_emotions * 100) if total_emotions > 0 else 0
        emotion_data.append({
            'emotion': emotion,
            'count': count,
            'percentage': percentage
        })
    
    # Sort by count
    emotion_data.sort(key=lambda x: x['count'], reverse=True)
    
    serializer = EmotionFrequencySerializer(emotion_data, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsCounsellorOrAdmin])
def counsellor_shared_journals(request):
    """Get journals shared with counsellors."""
    user = request.user
    
    if user.is_counsellor():
        # Get journals from users in the same institute
        shared_journals = Journal.objects.filter(
            shared_with_counsellor=True,
            user__institute_name=user.institute_name
        ).select_related('user').order_by('-created_at')
    elif user.is_institute_admin() or user.is_superadmin():
        # Admins can see all shared journals
        shared_journals = Journal.objects.filter(
            shared_with_counsellor=True
        ).select_related('user').order_by('-created_at')
    else:
        return Response(
            {'error': 'Permission denied'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Paginate results
    from rest_framework.pagination import PageNumberPagination
    paginator = PageNumberPagination()
    page = paginator.paginate_queryset(shared_journals, request)
    
    if page is not None:
        serializer = JournalSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    serializer = JournalSerializer(shared_journals, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def generate_insights(request):
    """Generate AI insights for user's journal entries."""
    user = request.user
    days = int(request.data.get('days', 7))
    
    # Trigger background task for insight generation
    generate_journal_insights.delay(user.id, days)
    
    return Response({
        'message': 'Insight generation started. You will receive a notification when ready.'
    })
