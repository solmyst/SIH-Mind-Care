"""
Admin configuration for journals app.
"""

from django.contrib import admin
from django.utils.html import format_html
from .models import Journal, JournalPrompt, JournalAnalytics, JournalReminder


@admin.register(Journal)
class JournalAdmin(admin.ModelAdmin):
    """Admin configuration for Journal model."""
    
    list_display = [
        'user', 'title_preview', 'mood_level', 'mood_color', 
        'risk_level', 'entry_type', 'word_count', 'created_at'
    ]
    list_filter = [
        'mood_level', 'risk_level', 'entry_type', 'is_private',
        'shared_with_counsellor', 'created_at'
    ]
    search_fields = ['user__email', 'title', 'content']
    readonly_fields = [
        'id', 'word_count', 'sentiment_score',
        'voice_transcription', 'ai_insights', 'created_at', 'updated_at'
    ]
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('id', 'user', 'title', 'content', 'entry_type')
        }),
        ('Voice Entry', {
            'fields': ('voice_file', 'voice_transcription')
        }),
        ('Mood & Emotions', {
            'fields': ('mood_level', 'emotions', 'tags')
        }),
        ('Context', {
            'fields': ('weather', 'location')
        }),
        ('AI Analysis', {
            'fields': ('sentiment_score', 'risk_level', 'ai_insights')
        }),
        ('Privacy', {
            'fields': ('is_private', 'shared_with_counsellor')
        }),
        ('Metadata', {
            'fields': ('word_count', 'created_at', 'updated_at')
        }),
    )
    
    def title_preview(self, obj):
        """Show title preview or content start."""
        if obj.title:
            return obj.title[:50] + '...' if len(obj.title) > 50 else obj.title
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    title_preview.short_description = 'Title/Content'
    
    def mood_color(self, obj):
        """Display mood level with color."""
        color = obj.get_mood_display_color()
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_mood_level_display()
        )
    mood_color.short_description = 'Mood'
    
    def get_queryset(self, request):
        """Filter based on user permissions."""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        elif hasattr(request.user, 'is_institute_admin') and request.user.is_institute_admin():
            return qs.filter(user__institute_name=request.user.institute_name)
        elif hasattr(request.user, 'is_counsellor') and request.user.is_counsellor():
            return qs.filter(
                user__institute_name=request.user.institute_name,
                shared_with_counsellor=True
            )
        return qs.none()


@admin.register(JournalPrompt)
class JournalPromptAdmin(admin.ModelAdmin):
    """Admin configuration for JournalPrompt model."""
    
    list_display = [
        'title', 'category', 'is_active', 'usage_count', 'created_at'
    ]
    list_filter = ['category', 'is_active', 'created_at']
    search_fields = ['title', 'prompt_text']
    ordering = ['category', 'title']
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'prompt_text', 'category')
        }),
        ('Targeting', {
            'fields': ('target_mood_levels', 'is_active')
        }),
        ('Stats', {
            'fields': ('usage_count',)
        }),
    )
    
    readonly_fields = ['usage_count']


@admin.register(JournalAnalytics)
class JournalAnalyticsAdmin(admin.ModelAdmin):
    """Admin configuration for JournalAnalytics model."""
    
    list_display = [
        'user', 'date', 'entry_count', 'average_mood', 
        'high_risk_days', 'voice_entries_count'
    ]
    list_filter = ['date', 'week_start', 'month_start', 'high_risk_days']
    search_fields = ['user__email']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-date']
    
    fieldsets = (
        ('User & Date', {
            'fields': ('user', 'date', 'week_start', 'month_start')
        }),
        ('Entry Metrics', {
            'fields': (
                'entry_count', 'total_words', 'voice_entries_count'
            )
        }),
        ('Mood Metrics', {
            'fields': (
                'average_mood', 'mood_variance', 'consecutive_positive_days',
                'consecutive_negative_days'
            )
        }),
        ('Risk Tracking', {
            'fields': ('high_risk_days',)
        }),
        ('Content Analysis', {
            'fields': ('tags_used', 'most_common_emotions')
        }),
    )
    
    def get_queryset(self, request):
        """Filter based on user permissions."""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        elif hasattr(request.user, 'is_institute_admin') and request.user.is_institute_admin():
            return qs.filter(user__institute_name=request.user.institute_name)
        return qs.none()


@admin.register(JournalReminder)
class JournalReminderAdmin(admin.ModelAdmin):
    """Admin configuration for JournalReminder model."""
    
    list_display = [
        'user', 'reminder_time', 'days_display', 'is_active', 
        'total_sent', 'last_sent'
    ]
    list_filter = ['is_active', 'reminder_time', 'created_at']
    search_fields = ['user__email', 'message']
    readonly_fields = ['last_sent', 'total_sent', 'created_at', 'updated_at']
    
    fieldsets = (
        ('User & Timing', {
            'fields': ('user', 'reminder_time', 'days_of_week', 'is_active')
        }),
        ('Message', {
            'fields': ('message',)
        }),
        ('Tracking', {
            'fields': ('last_sent', 'total_sent')
        }),
    )
    
    def days_display(self, obj):
        """Display days of week in readable format."""
        day_names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        selected_days = [day_names[day] for day in obj.days_of_week]
        return ', '.join(selected_days)
    days_display.short_description = 'Days'
    
    def get_queryset(self, request):
        """Users can only see their own reminders."""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(user=request.user)
