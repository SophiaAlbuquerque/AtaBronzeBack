@echo off
REM Setup script for Atabrinze API (Windows)

echo 🚀 Setting up Atabrinze API...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or later.
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

REM Copy environment file if it doesn't exist
if not exist .env (
    echo 📄 Copying environment file...
    copy .env.example .env
    echo ✅ Please edit .env file with your configuration
) else (
    echo ✅ Environment file already exists
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npm run db:generate
if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma client
    exit /b 1
)

REM Build the project
echo 🔨 Building project...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Failed to build project
    exit /b 1
)

REM Run tests
echo 🧪 Running tests...
npm test
if %errorlevel% neq 0 (
    echo ⚠️  Some tests failed, but setup continues...
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Edit .env file with your database and API credentials
echo 2. Set up your PostgreSQL database
echo 3. Run migrations: npm run db:migrate
echo 4. Start development server: npm run dev
echo.
echo The API will be available at: http://localhost:3000
echo Health check: http://localhost:3000/api/health

pause
