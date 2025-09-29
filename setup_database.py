"""
Database setup script for SIH Backend (without vector extensions)
Creates the database for standard PostgreSQL
"""

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os

def setup_database():
    """Create database for SIH Backend"""
    
    # Database connection parameters
    DB_USER = 'postgres'
    DB_PASSWORD = 'admin79***'
    DB_HOST = 'localhost'
    DB_PORT = '5432'
    DB_NAME = 'sih_backend'
    
    print("🗄️  Setting up PostgreSQL database for SIH Backend...")
    
    try:
        # Connect to PostgreSQL server (not to a specific database)
        print(f"📡 Connecting to PostgreSQL server at {DB_HOST}:{DB_PORT}...")
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database='postgres'  # Connect to default postgres database
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (DB_NAME,))
        exists = cursor.fetchone()
        
        if exists:
            print(f"📊 Database '{DB_NAME}' already exists")
        else:
            # Create database
            print(f"📊 Creating database '{DB_NAME}'...")
            cursor.execute(f'CREATE DATABASE "{DB_NAME}"')
            print(f"✅ Database '{DB_NAME}' created successfully")
        
        cursor.close()
        conn.close()
        
        # Connect to the new database to verify
        print(f"🔌 Connecting to database '{DB_NAME}'...")
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Verify connection and get PostgreSQL version
        cursor.execute("SELECT version()")
        version = cursor.fetchone()[0]
        print(f"✅ Successfully connected to PostgreSQL: {version}")
        
        # Check available extensions (optional)
        cursor.execute("SELECT name FROM pg_available_extensions WHERE name LIKE '%json%' ORDER BY name")
        json_extensions = cursor.fetchall()
        if json_extensions:
            print(f"📦 JSON support available: {[ext[0] for ext in json_extensions]}")
        
        cursor.close()
        conn.close()
        
        print("\n🎉 Database setup completed successfully!")
        print(f"📊 Database: {DB_NAME}")
        print(f"👤 User: {DB_USER}")
        print(f"🌐 Host: {DB_HOST}:{DB_PORT}")
        print(f"🔗 Connection URL: postgresql://{DB_USER}:***@{DB_HOST}:{DB_PORT}/{DB_NAME}")
        print("\n✨ Features available:")
        print("   ✅ JSON fields for data aggregation")
        print("   ✅ Full-text search capabilities")
        print("   ✅ Advanced indexing")
        print("   ✅ All AI features (keyword-based similarity)")
        
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Database error: {e}")
        print("\n🔧 Troubleshooting:")
        print("   1. Check if PostgreSQL is running")
        print("   2. Verify password is correct: admin79***")
        print("   3. Ensure user 'postgres' has database creation privileges")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    setup_database()