"""
Custom createsuperuser command for email-based authentication.
"""

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import getpass
import sys

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a superuser with email instead of username'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            help='Email address for the superuser',
        )
        parser.add_argument(
            '--first-name',
            help='First name for the superuser',
        )
        parser.add_argument(
            '--last-name', 
            help='Last name for the superuser',
        )
        parser.add_argument(
            '--no-input',
            action='store_true',
            help='Don\'t prompt for any input',
        )
    
    def handle(self, *args, **options):
        email = options.get('email')
        first_name = options.get('first_name')
        last_name = options.get('last_name')
        no_input = options.get('no_input')
        
        # Get email
        if not email:
            if no_input:
                raise CommandError('--email is required when --no-input is used')
            
            email = input('Email address: ')
        
        # Validate email
        try:
            validate_email(email)
        except ValidationError:
            raise CommandError('Invalid email address')
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            raise CommandError(f'User with email {email} already exists')
        
        # Get first name
        if not first_name:
            if no_input:
                first_name = 'Admin'
            else:
                first_name = input('First name: ') or 'Admin'
        
        # Get last name
        if not last_name:
            if no_input:
                last_name = 'User'
            else:
                last_name = input('Last name: ') or 'User'
        
        # Get password
        if no_input:
            password = 'admin123'  # Default password for automated setup
            self.stdout.write(
                self.style.WARNING('Using default password: admin123')
            )
        else:
            password = None
            while not password:
                password = getpass.getpass('Password: ')
                if not password:
                    self.stderr.write('Password cannot be empty')
                    continue
                
                password2 = getpass.getpass('Password (again): ')
                if password != password2:
                    self.stderr.write('Passwords do not match')
                    password = None
        
        try:
            # Create superuser
            user = User.objects.create_superuser(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            
            self.stdout.write(
                self.style.SUCCESS(f'✅ Superuser created successfully!')
            )
            self.stdout.write(f'Email: {user.email}')
            self.stdout.write(f'Name: {user.full_name}')
            self.stdout.write(f'Role: {user.get_role_display()}')
            
        except Exception as e:
            raise CommandError(f'Error creating superuser: {e}')