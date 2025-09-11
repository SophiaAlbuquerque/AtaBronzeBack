#!/bin/sh

# Create data directory if it doesn't exist
mkdir -p /app/data

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting the application..."
exec node dist/index.js
