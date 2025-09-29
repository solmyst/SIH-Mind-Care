@echo off
echo 🗄️  SIH Backend Database Setup
echo ===============================
echo.

echo Checking Python and dependencies...
py -c "import psycopg2; print('✅ psycopg2 is installed')" 2>nul
if errorlevel 1 (
    echo ❌ psycopg2 not found. Installing...
    pip install psycopg2-binary
)

echo.
echo Setting up database with your PostgreSQL credentials...
echo Database: sih_backend
echo User: postgres
echo Host: localhost:5432
echo.

py setup_database.py

if errorlevel 1 (
    echo.
    echo ❌ Database setup failed. Please check:
    echo 1. PostgreSQL is running
    echo 2. Your password is correct
    echo 3. User 'postgres' has database creation privileges
    pause
    exit /b 1
)

echo.
echo ✅ Database setup completed!
echo.
echo Next steps:
echo 1. Run: py manage.py migrate
echo 2. Run: py manage.py setup_initial_data
echo 3. Run: py manage.py createsuperuser
echo.
pause