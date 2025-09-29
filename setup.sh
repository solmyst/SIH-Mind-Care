#!/bin/bash

# SIH Backend Setup Script
# This script sets up the development environment for the SIH Backend

echo "🚀 Setting up SIH Backend Development Environment"
echo "================================================"

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.10+ and try again."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL and try again."
    exit 1
fi

# Check if Redis is installed
if ! command -v redis-server &> /dev/null; then
    echo "❌ Redis is not installed. Please install Redis and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration before proceeding."
    read -p "Press Enter after updating .env file..."
fi

# Database setup
echo "🗄️  Setting up database..."
read -p "Enter PostgreSQL database name (default: sih_backend): " DB_NAME
DB_NAME=${DB_NAME:-sih_backend}

read -p "Enter PostgreSQL username (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -s -p "Enter PostgreSQL password: " DB_PASSWORD
echo

# Create database
echo "📊 Creating database..."
PGPASSWORD=$DB_PASSWORD createdb -U $DB_USER -h localhost $DB_NAME 2>/dev/null || echo "Database might already exist"

# Enable pgvector extension
echo "🔧 Enabling pgvector extension..."
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h localhost -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS vector;" 2>/dev/null

# Update .env with database URL
DB_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
sed -i "s|DATABASE_URL=.*|DATABASE_URL=$DB_URL|" .env

# Run migrations
echo "🔄 Running database migrations..."
python manage.py migrate

# Create superuser
echo "👤 Creating superuser..."
echo "Please create a superuser account:"
python manage.py createsuperuser

# Set up initial data
echo "📝 Setting up initial data..."
python manage.py setup_initial_data

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server:"
echo "1. Start Redis: redis-server"
echo "2. Start Celery: celery -A sih_backend worker -l info"
echo "3. Start Django: python manage.py runserver"
echo ""
echo "Access the application at: http://localhost:8000"
echo "API Documentation: http://localhost:8000/swagger/"
echo "Admin Panel: http://localhost:8000/admin/"