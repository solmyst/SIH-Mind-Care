"""
Admin configuration for users app.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, UserProfile, UserSession


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for User model."""
    
    list_display = [
        'email', 'full_name', 'role', 'institute_name', 
        'is_verified', 'is_active', 'created_at'
    ]
    list_filter = [
        'role', 'is_verified', 'is_active', 'institute_name', 'created_at'
    ]
    search_fields = ['email', 'first_name', 'last_name', 'institute_name']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {
            'fields': (
                'first_name', 'last_name', 'phone_number', 
                'date_of_birth', 'profile_picture'
            )
        }),
        ('Role & Institute', {
            'fields': ('role', 'institute_name', 'student_id')
        }),
        ('Permissions', {
            'fields': (
                'is_active', 'is_verified', 'is_profile_public',
                'is_staff', 'is_superuser', 'groups', 'user_permissions'
            )
        }),
        ('Important dates', {
            'fields': ('last_login', 'last_active', 'created_at', 'updated_at')
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'first_name', 'last_name', 'role',
                'password1', 'password2'
            ),
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'last_active']
    
    def get_queryset(self, request):
        """Filter queryset based on user permissions."""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # Institute admins can only see users from their institute
        elif hasattr(request.user, 'institute_name') and request.user.institute_name:
            return qs.filter(institute_name=request.user.institute_name)
        return qs.none()


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin configuration for UserProfile model."""
    
    list_display = [
        'user', 'course', 'year_of_study', 'graduation_year',
        'email_notifications', 'created_at'
    ]
    list_filter = [
        'course', 'year_of_study', 'graduation_year', 
        'email_notifications', 'push_notifications'
    ]
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'course']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Academic Info', {
            'fields': ('course', 'year_of_study', 'graduation_year')
        }),
        ('Preferences', {
            'fields': (
                'preferred_language', 'timezone', 
                'email_notifications', 'push_notifications'
            )
        }),
        ('Emergency Contact', {
            'fields': (
                'emergency_contact_name', 'emergency_contact_phone',
                'emergency_contact_relationship'
            )
        }),
        ('Counsellor Info', {
            'fields': (
                'license_number', 'specializations', 'years_of_experience'
            )
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    """Admin configuration for UserSession model."""
    
    list_display = [
        'user', 'ip_address', 'login_time', 'logout_time', 
        'is_active', 'session_duration'
    ]
    list_filter = ['is_active', 'login_time', 'logout_time']
    search_fields = ['user__email', 'ip_address', 'session_key']
    readonly_fields = ['login_time', 'last_activity', 'session_duration']
    ordering = ['-login_time']
    
    def session_duration(self, obj):
        """Calculate session duration."""
        if obj.logout_time:
            duration = obj.logout_time - obj.login_time
            return str(duration).split('.')[0]  # Remove microseconds
        elif obj.is_active:
            return "Active"
        return "Unknown"
    
    session_duration.short_description = "Duration"
    
    def get_queryset(self, request):
        """Filter sessions based on user permissions."""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # Users can only see their own sessions
        return qs.filter(user=request.user)
