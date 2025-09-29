@echo off
REM SIH Backend Setup Script for Windows
REM This script sets up the development environment for the SIH Backend

echo 🚀 Setting up SIH Backend Development Environment
echo ================================================

REM Check if Python is installed
py --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.10+ and try again.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating virtual environment...
    py -m venv venv
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate

REM Install dependencies
echo 📥 Installing Python dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo ⚙️  Creating .env file...
    copy .env.example .env
    echo 📝 Please edit .env file with your configuration.
    echo Press any key after updating .env file...
    pause >nul
)

echo 🗄️  Database setup (manual step required)
echo Please ensure PostgreSQL is running and create a database named 'sih_backend'
echo Also ensure Redis is running
echo.
echo SQL commands to run:
echo CREATE DATABASE sih_backend;
echo CREATE EXTENSION IF NOT EXISTS vector;
echo.
pause

REM Run migrations
echo 🔄 Running database migrations...
py manage.py migrate

REM Create superuser
echo 👤 Creating superuser...
echo Please create a superuser account:
py manage.py createsuperuser

REM Set up initial data
echo 📝 Setting up initial data...
py manage.py setup_initial_data

REM Collect static files
echo 📁 Collecting static files...
py manage.py collectstatic --noinput

echo.
echo 🎉 Setup complete!
echo.
echo To start the development server:
echo 1. Start Redis: redis-server
echo 2. Start Celery: celery -A sih_backend worker -l info
echo 3. Start Django: py manage.py runserver
echo.
echo Access the application at: http://localhost:8000
echo API Documentation: http://localhost:8000/swagger/
echo Admin Panel: http://localhost:8000/admin/
echo.
pause