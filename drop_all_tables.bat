@echo off
echo ⚠️  DANGER: This will delete ALL data in the database!
echo Database: sih_backend
echo.
set /p confirm="Type 'DELETE ALL DATA' to confirm: "

if not "%confirm%"=="DELETE ALL DATA" (
    echo ❌ Aborted. Data is safe.
    pause
    exit /b 1
)

echo.
echo 🗄️  Dropping all tables in sih_backend database...
echo.

REM Method 1: Drop all tables but keep database
psql -U postgres -h localhost -p 5432 -d sih_backend -c "DO $$ DECLARE r RECORD; BEGIN SET session_replication_role = replica; FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE'; RAISE NOTICE 'Dropped table: %%', r.tablename; END LOOP; SET session_replication_role = DEFAULT; END $$;"

if errorlevel 1 (
    echo.
    echo ❌ Failed to drop tables. Trying nuclear option...
    echo.
    
    REM Method 2: Drop and recreate entire database
    psql -U postgres -h localhost -p 5432 -d postgres -c "DROP DATABASE IF EXISTS sih_backend; CREATE DATABASE sih_backend;"
    
    if errorlevel 1 (
        echo ❌ Failed to reset database. Please check your PostgreSQL connection.
        pause
        exit /b 1
    )
)

echo.
echo ✅ Database reset complete!
echo.
echo 📋 Next steps:
echo 1. py manage.py makemigrations
echo 2. py manage.py migrate  
echo 3. py manage.py createsuperuser
echo 4. py manage.py setup_initial_data
echo.
pause