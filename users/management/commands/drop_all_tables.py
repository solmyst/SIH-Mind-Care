"""
Management command to drop all tables and reset the database.
Use with caution - this will delete ALL data!
"""

from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings
import sys

class Command(BaseCommand):
    help = 'Drop all tables in the database (DANGEROUS - will delete ALL data!)'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirm that you want to drop all tables',
        )
        parser.add_argument(
            '--reset-migrations',
            action='store_true',
            help='Also delete migration files after dropping tables',
        )
    
    def handle(self, *args, **options):
        if not options['confirm']:
            self.stdout.write(
                self.style.ERROR('⚠️  DANGER: This will delete ALL data in the database!')
            )
            self.stdout.write('Use --confirm flag if you really want to proceed:')
            self.stdout.write('py manage.py drop_all_tables --confirm')
            return
        
        # Double confirmation for safety
        self.stdout.write(
            self.style.ERROR('⚠️  FINAL WARNING: This will DELETE ALL DATA!')
        )
        self.stdout.write(f"Database: {settings.DATABASES['default']['NAME']}")
        
        confirm = input('Type "DELETE ALL DATA" to confirm: ')
        if confirm != "DELETE ALL DATA":
            self.stdout.write(self.style.ERROR('❌ Aborted. Data is safe.'))
            return
        
        self.stdout.write('🗄️  Dropping all tables...')
        
        try:
            with connection.cursor() as cursor:
                # Get all table names
                cursor.execute("""
                    SELECT tablename FROM pg_tables 
                    WHERE schemaname = 'public' 
                    AND tablename NOT LIKE 'pg_%'
                """)
                tables = cursor.fetchall()
                
                if not tables:
                    self.stdout.write('📭 No tables found to drop.')
                    return
                
                # Disable foreign key checks temporarily
                cursor.execute('SET session_replication_role = replica;')
                
                # Drop each table
                dropped_count = 0
                for table in tables:
                    table_name = table[0]
                    try:
                        cursor.execute(f'DROP TABLE IF EXISTS "{table_name}" CASCADE')
                        self.stdout.write(f'  ✅ Dropped table: {table_name}')
                        dropped_count += 1
                    except Exception as e:
                        self.stdout.write(f'  ❌ Failed to drop {table_name}: {e}')
                
                # Re-enable foreign key checks
                cursor.execute('SET session_replication_role = DEFAULT;')
                
                # Drop Django migration tables
                cursor.execute('DROP TABLE IF EXISTS django_migrations CASCADE')
                cursor.execute('DROP TABLE IF EXISTS django_content_type CASCADE')
                cursor.execute('DROP TABLE IF EXISTS auth_permission CASCADE')
                self.stdout.write('  ✅ Dropped Django system tables')
                
                self.stdout.write(
                    self.style.SUCCESS(f'🎉 Successfully dropped {dropped_count} tables!')
                )
                
                # Handle migration files if requested
                if options['reset_migrations']:
                    self.reset_migrations()
                
                self.stdout.write('\n📋 Next steps:')
                self.stdout.write('1. py manage.py makemigrations')
                self.stdout.write('2. py manage.py migrate')
                self.stdout.write('3. py manage.py createsuperuser')
                self.stdout.write('4. py manage.py setup_initial_data')
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error dropping tables: {e}')
            )
    
    def reset_migrations(self):
        """Delete migration files (except __init__.py)"""
        import os
        import glob
        
        self.stdout.write('🔄 Resetting migration files...')
        
        apps = ['users', 'journals', 'chat', 'posts', 'counselling', 'groups', 'analytics', 'wearables']
        
        for app in apps:
            migrations_dir = os.path.join(settings.BASE_DIR, app, 'migrations')
            if os.path.exists(migrations_dir):
                # Remove all .py files except __init__.py
                for file_path in glob.glob(os.path.join(migrations_dir, '*.py')):
                    if not file_path.endswith('__init__.py'):
                        try:
                            os.remove(file_path)
                            self.stdout.write(f'  ✅ Removed: {file_path}')
                        except Exception as e:
                            self.stdout.write(f'  ❌ Failed to remove {file_path}: {e}')
                
                # Remove __pycache__ directories
                pycache_dir = os.path.join(migrations_dir, '__pycache__')
                if os.path.exists(pycache_dir):
                    import shutil
                    try:
                        shutil.rmtree(pycache_dir)
                        self.stdout.write(f'  ✅ Removed: {pycache_dir}')
                    except Exception as e:
                        self.stdout.write(f'  ❌ Failed to remove {pycache_dir}: {e}')
        
        self.stdout.write('✅ Migration files reset complete!')