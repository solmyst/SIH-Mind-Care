REM PostgreSQL Database Setup Commands for SIH Backend (Simplified)
REM Use these commands to set up your database manually

REM 1. Create the database (connect to postgres database first)
psql -U postgres -h localhost -p 5432 -d postgres -c "CREATE DATABASE sih_backend;"

REM 2. Test connection to the new database
psql -U postgres -h localhost -p 5432 -d sih_backend -c "SELECT current_database(), version();"

REM 3. Verify JSON support (should work out of the box)
psql -U postgres -h localhost -p 5432 -d sih_backend -c "SELECT '{\"test\": \"json\"}'::json;"

echo.
echo ✅ Database setup completed!
echo 📊 Database: sih_backend  
echo 👤 User: postgres
echo 🌐 Host: localhost:5432
echo.
echo ✨ Features available:
echo    ✅ JSON fields for data aggregation
echo    ✅ Keyword-based similarity search
echo    ✅ All AI features (without vector embeddings)
echo.
pause