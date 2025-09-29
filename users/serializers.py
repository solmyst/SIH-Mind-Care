"""
User serializers for API endpoints.
"""

from rest_framework import serializers
from django.contrib.auth import authenticate
from dj_rest_auth.registration.serializers import RegisterSerializer as BaseRegisterSerializer
from dj_rest_auth.serializers import UserDetailsSerializer as BaseUserDetailsSerializer
from .models import User, UserProfile, UserSession


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile information."""
    
    class Meta:
        model = UserProfile
        exclude = ['user']
        read_only_fields = ['created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user information with profile."""
    
    profile = UserProfileSerializer(read_only=True)
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name', 
            'role', 'phone_number', 'date_of_birth', 'profile_picture',
            'institute_name', 'student_id', 'is_profile_public', 
            'is_verified', 'last_active', 'created_at', 'profile'
        ]
        read_only_fields = [
            'id', 'is_verified', 'last_active', 'created_at', 'full_name'
        ]
    
    def update(self, instance, validated_data):
        """Update user instance with profile data."""
        profile_data = self.context.get('profile_data', {})
        
        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update or create profile
        if profile_data:
            profile, created = UserProfile.objects.get_or_create(user=instance)
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()
        
        return instance


class RegisterSerializer(BaseRegisterSerializer):
    """Custom registration serializer with additional fields."""
    
    first_name = serializers.CharField(required=True, max_length=30)
    last_name = serializers.CharField(required=True, max_length=30)
    role = serializers.ChoiceField(
        choices=User.Role.choices, 
        default=User.Role.STUDENT
    )
    institute_name = serializers.CharField(required=False, max_length=200)
    student_id = serializers.CharField(required=False, max_length=50)
    
    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data.update({
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'role': self.validated_data.get('role', User.Role.STUDENT),
            'institute_name': self.validated_data.get('institute_name', ''),
            'student_id': self.validated_data.get('student_id', ''),
        })
        return data
    
    def save(self, request):
        user = super().save(request)
        # Create user profile
        UserProfile.objects.get_or_create(user=user)
        return user


class UserDetailsSerializer(BaseUserDetailsSerializer):
    """Custom user details serializer."""
    
    profile = UserProfileSerializer(read_only=True)
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'role', 'phone_number', 'date_of_birth', 'profile_picture',
            'institute_name', 'student_id', 'is_profile_public',
            'is_verified', 'last_active', 'created_at', 'profile'
        ]
        read_only_fields = [
            'id', 'email', 'role', 'is_verified', 'last_active', 
            'created_at', 'full_name'
        ]


class UserPublicSerializer(serializers.ModelSerializer):
    """Public user serializer for limited information display."""
    
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 
            'role', 'profile_picture', 'institute_name'
        ]


class UserSessionSerializer(serializers.ModelSerializer):
    """Serializer for user session tracking."""
    
    class Meta:
        model = UserSession
        fields = [
            'id', 'session_key', 'ip_address', 'user_agent',
            'login_time', 'logout_time', 'last_activity', 'is_active'
        ]
        read_only_fields = ['id', 'login_time', 'last_activity']


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change."""
    
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)
    
    def validate(self, attrs):
        user = self.context['request'].user
        
        # Verify old password
        if not authenticate(username=user.email, password=attrs['old_password']):
            raise serializers.ValidationError("Old password is incorrect.")
        
        # Check new password confirmation
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("New passwords do not match.")
        
        return attrs
    
    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""
    
    # User fields
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    phone_number = serializers.CharField(source='user.phone_number', required=False)
    date_of_birth = serializers.DateField(source='user.date_of_birth', required=False)
    profile_picture = serializers.ImageField(source='user.profile_picture', required=False)
    institute_name = serializers.CharField(source='user.institute_name', required=False)
    student_id = serializers.CharField(source='user.student_id', required=False)
    is_profile_public = serializers.BooleanField(source='user.is_profile_public', required=False)
    
    class Meta:
        model = UserProfile
        fields = [
            'first_name', 'last_name', 'phone_number', 'date_of_birth',
            'profile_picture', 'institute_name', 'student_id', 'is_profile_public',
            'course', 'year_of_study', 'graduation_year', 'preferred_language',
            'timezone', 'email_notifications', 'push_notifications',
            'emergency_contact_name', 'emergency_contact_phone', 
            'emergency_contact_relationship'
        ]
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        
        # Update user fields
        user = instance.user
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()
        
        # Update profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance