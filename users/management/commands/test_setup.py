"""
Quick test command to verify the setup is working.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import connection

User = get_user_model()

class Command(BaseCommand):
    help = 'Test database connection and basic functionality'
    
    def handle(self, *args, **options):
        self.stdout.write('🧪 Testing SIH Backend Setup...')
        self.stdout.write('=' * 40)
        
        # Test 1: Database connection
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT version()")
                db_version = cursor.fetchone()[0]
            self.stdout.write(f'✅ Database: Connected to PostgreSQL')
            self.stdout.write(f'   Version: {db_version.split(",")[0]}')
        except Exception as e:
            self.stdout.write(f'❌ Database: Connection failed - {e}')
            return
        
        # Test 2: User model
        try:
            user_count = User.objects.count()
            superuser_count = User.objects.filter(is_superuser=True).count()
            self.stdout.write(f'✅ User Model: Working')
            self.stdout.write(f'   Total users: {user_count}')
            self.stdout.write(f'   Superusers: {superuser_count}')
        except Exception as e:
            self.stdout.write(f'❌ User Model: Error - {e}')
        
        # Test 3: Check if superuser exists
        try:
            admin_user = User.objects.filter(email='admin@sih.com').first()
            if admin_user:
                self.stdout.write(f'✅ Admin User: Found')
                self.stdout.write(f'   Email: {admin_user.email}')
                self.stdout.write(f'   Name: {admin_user.full_name}')
                self.stdout.write(f'   Role: {admin_user.get_role_display()}')
            else:
                self.stdout.write('⚠️  Admin User: Not found (admin@sih.com)')
        except Exception as e:
            self.stdout.write(f'❌ Admin User: Error - {e}')
        
        # Test 4: Check apps
        apps_to_check = ['users', 'journals', 'chat']
        for app in apps_to_check:
            try:
                # Try to import the models
                if app == 'users':
                    from users.models import User, UserProfile
                elif app == 'journals':
                    from journals.models import Journal, JournalPrompt
                elif app == 'chat':
                    from chat.models import ChatSession, ChatMessage
                
                self.stdout.write(f'✅ App {app}: Models loaded successfully')
            except Exception as e:
                self.stdout.write(f'❌ App {app}: Error - {e}')
        
        # Test 5: Check initial data
        try:
            from journals.models import JournalPrompt
            from chat.models import ChatTemplate
            
            prompt_count = JournalPrompt.objects.count()
            template_count = ChatTemplate.objects.count()
            
            self.stdout.write(f'✅ Initial Data:')
            self.stdout.write(f'   Journal prompts: {prompt_count}')
            self.stdout.write(f'   Chat templates: {template_count}')
            
        except Exception as e:
            self.stdout.write(f'⚠️  Initial Data: {e}')
        
        self.stdout.write('')
        self.stdout.write('🎯 Setup Test Summary:')
        
        if user_count > 0:
            self.stdout.write('✅ Backend is ready to use!')
            self.stdout.write('')
            self.stdout.write('🚀 Next steps:')
            self.stdout.write('1. py manage.py runserver')
            self.stdout.write('2. Visit http://localhost:8000/admin/')
            self.stdout.write('3. Login with admin@sih.com / admin123')
            self.stdout.write('4. Check API docs at http://localhost:8000/swagger/')
        else:
            self.stdout.write('⚠️  Setup incomplete. Please run migrations and create superuser.')