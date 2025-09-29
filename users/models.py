"""
User models with role-based access control.
"""

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.core.validators import RegexValidator


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication."""
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and return a regular user with an email and password."""
        if not email:
            raise ValueError('The Email field must be set')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser with an email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'superadmin')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        # Set default names if not provided
        if not extra_fields.get('first_name'):
            extra_fields['first_name'] = 'Admin'
        if not extra_fields.get('last_name'):
            extra_fields['last_name'] = 'User'
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom user model with role-based access control.
    """
    
    class Role(models.TextChoices):
        STUDENT = 'student', 'Student'
        COUNSELLOR = 'counsellor', 'Counsellor'
        PEER_MODERATOR = 'peer_moderator', 'Peer Moderator'
        INSTITUTE_ADMIN = 'institute_admin', 'Institute Admin'
        SUPERADMIN = 'superadmin', 'Super Admin'
    
    # Remove username, use email as unique identifier
    username = None
    email = models.EmailField(unique=True)
    
    # Basic profile fields
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)
    
    # Additional profile fields
    phone_number = models.CharField(
        max_length=15, 
        validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$')],
        blank=True, null=True
    )
    date_of_birth = models.DateField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    
    # Institute/Organization
    institute_name = models.CharField(max_length=200, blank=True)
    student_id = models.CharField(max_length=50, blank=True)
    
    # Privacy settings
    is_profile_public = models.BooleanField(default=False)
    
    # Verification and status
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_active = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    objects = UserManager()
    
    class Meta:
        db_table = 'users_user'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['institute_name']),
        ]
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
    
    def has_role(self, role):
        """Check if user has specific role."""
        return self.role == role
    
    def is_student(self):
        return self.role == self.Role.STUDENT
    
    def is_counsellor(self):
        return self.role == self.Role.COUNSELLOR
    
    def is_peer_moderator(self):
        return self.role == self.Role.PEER_MODERATOR
    
    def is_institute_admin(self):
        return self.role == self.Role.INSTITUTE_ADMIN
    
    def is_superadmin(self):
        return self.role == self.Role.SUPERADMIN


class UserProfile(models.Model):
    """
    Extended user profile for additional information.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Academic information
    course = models.CharField(max_length=100, blank=True)
    year_of_study = models.IntegerField(blank=True, null=True)
    graduation_year = models.IntegerField(blank=True, null=True)
    
    # Personal preferences
    preferred_language = models.CharField(max_length=10, default='en')
    timezone = models.CharField(max_length=50, default='UTC')
    
    # Notification preferences
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    
    # Emergency contact
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True)
    emergency_contact_relationship = models.CharField(max_length=50, blank=True)
    
    # Counsellor specific fields
    license_number = models.CharField(max_length=100, blank=True)
    specializations = models.JSONField(default=list, blank=True)
    years_of_experience = models.IntegerField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users_profile'
    
    def __str__(self):
        return f"Profile of {self.user.full_name}"


class UserSession(models.Model):
    """
    Track user sessions for analytics and security.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    session_key = models.CharField(max_length=40, unique=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    
    # Session tracking
    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(blank=True, null=True)
    last_activity = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'users_session'
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['session_key']),
        ]
    
    def __str__(self):
        return f"Session for {self.user.email} from {self.ip_address}"
