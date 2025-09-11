#!/bin/bash

# Setup script for AtaBronze API

echo "🚀 Setting up AtaBronze API..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or later."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or later. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Copying environment file..."
    cp .env.example .env
    echo "✅ Please edit .env file with your configuration"
else
    echo "✅ Environment file already exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build project"
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo "⚠️  Some tests failed, but setup continues..."
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your database and API credentials"
echo "2. Set up your PostgreSQL database"
echo "3. Run migrations: npm run db:migrate"
echo "4. Start development server: npm run dev"
echo ""
echo "The API will be available at: http://localhost:3000"
echo "Health check: http://localhost:3000/api/health"
