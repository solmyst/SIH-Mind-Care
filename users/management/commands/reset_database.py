"""
Quick database reset utility - combines drop tables + fresh migrations
"""

from django.core.management.base import BaseCommand
from django.core.management import call_command
import sys

class Command(BaseCommand):
    help = 'Complete database reset: drop tables, remake migrations, migrate, setup data'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirm that you want to reset the entire database',
        )
        parser.add_argument(
            '--skip-superuser',
            action='store_true',
            help='Skip creating superuser (useful for automated setups)',
        )
    
    def handle(self, *args, **options):
        if not options['confirm']:
            self.stdout.write(
                self.style.ERROR('⚠️  This will COMPLETELY RESET the database!')
            )
            self.stdout.write('All data will be lost. Use --confirm to proceed:')
            self.stdout.write('py manage.py reset_database --confirm')
            return
        
        self.stdout.write(
            self.style.WARNING('🔄 Starting complete database reset...')
        )
        
        try:
            # Step 1: Drop all tables
            self.stdout.write('1️⃣ Dropping all tables...')
            call_command('drop_all_tables', '--confirm', '--reset-migrations')
            
            # Step 2: Create new migrations
            self.stdout.write('2️⃣ Creating new migrations...')
            call_command('makemigrations')
            
            # Step 3: Apply migrations
            self.stdout.write('3️⃣ Applying migrations...')
            call_command('migrate')
            
            # Step 4: Create superuser (unless skipped)
            if not options['skip_superuser']:
                self.stdout.write('4️⃣ Creating superuser...')
                try:
                    call_command('createsuperuser')
                except KeyboardInterrupt:
                    self.stdout.write('⏭️  Skipped superuser creation.')
            
            # Step 5: Setup initial data
            self.stdout.write('5️⃣ Setting up initial data...')
            call_command('setup_initial_data')
            
            self.stdout.write(
                self.style.SUCCESS('\n🎉 Database reset complete!')
            )
            self.stdout.write('✅ Fresh database with initial data ready!')
            self.stdout.write('🚀 You can now start the development server.')
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error during database reset: {e}')
            )
            sys.exit(1)