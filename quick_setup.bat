@echo off
echo 🚀 SIH Backend Quick Setup
echo =========================
echo.

echo 📊 Creating database...
psql -U postgres -h localhost -p 5432 -d postgres -c "CREATE DATABASE IF NOT EXISTS sih_backend;"

if errorlevel 1 (
    echo ❌ Database creation failed. Please check PostgreSQL connection.
    pause
    exit /b 1
)

echo ✅ Database created successfully!
echo.

echo 📦 Installing dependencies...
pip install -r requirements.txt

if errorlevel 1 (
    echo ❌ Failed to install dependencies.
    pause
    exit /b 1
)

echo ✅ Dependencies installed!
echo.

echo 🔄 Running migrations...
py manage.py makemigrations
py manage.py migrate

if errorlevel 1 (
    echo ❌ Migration failed.
    pause
    exit /b 1
)

echo ✅ Migrations completed!
echo.

echo 👤 Creating superuser...
echo Default credentials will be used for quick setup:
echo Email: admin@sih.com
echo Password: admin123
echo.

py manage.py createsuperuser --email admin@sih.com --first-name Admin --last-name User --no-input

if errorlevel 1 (
    echo ❌ Superuser creation failed.
    pause
    exit /b 1
)

echo ✅ Superuser created!
echo.

echo 📝 Setting up initial data...
py manage.py setup_initial_data

if errorlevel 1 (
    echo ⚠️  Initial data setup failed, but continuing...
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Your superuser credentials:
echo Email: admin@sih.com
echo Password: admin123
echo.
echo 🚀 To start the server, run:
echo py manage.py runserver
echo.
echo 🌐 Then visit:
echo http://localhost:8000/admin/ (Admin panel)
echo http://localhost:8000/swagger/ (API docs)
echo.
pause