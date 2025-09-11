# 🚀 Deployment Guide - AtaBronze API

## 📋 Prerequisites

### Local Development
- Node.js 18+
- npm or yarn
- SQLite (embedded, no installation needed)

### Production Deployment
- Docker and Docker Compose
- PostgreSQL (if not using Docker)

## 🔧 Environment Setup

### 1. Local Development (SQLite)
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure for SQLite (default)
# DATABASE_URL="file:./dev.db"

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

### 2. Production with PostgreSQL
```bash
# Update .env for PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/atabrinze_db?schema=public"

# Update Prisma schema for PostgreSQL
# Change: provider = "sqlite" to provider = "postgresql"

# Generate and migrate
npm run db:generate
npm run db:migrate

# Build and start
npm run build
npm start
```

## 🐳 Docker Deployment

### Build and Run with Docker
```bash
# Build the image
docker build -t atabrinze-api .

# Run with Docker Compose (recommended)
docker-compose up -d

# Or run standalone
docker run -p 3000:3000 -e DATABASE_URL="file:./data/dev.db" atabrinze-api
```

### Docker Compose Services
```yaml
# Full stack with PostgreSQL
docker-compose -f docker-compose.prod.yml up -d

# Development with SQLite
docker-compose -f docker-compose.dev.yml up -d
```

## 🌐 Cloud Deployment

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway up
```

### Heroku
```bash
# Install Heroku CLI
# Create Heroku app
heroku create atabrinze-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL="postgresql://..."
heroku config:set JWT_SECRET="your-jwt-secret"

# Deploy
git push heroku main
```

## 🔐 Environment Variables

### Required Variables
```env
NODE_ENV=production
PORT=3000
DATABASE_URL="your-database-url"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN=7d
```

### Optional API Keys
```env
BLING_API_KEY=your-bing-api-key
ASAAS_API_KEY=your-asaas-api-key
```

## 🏗️ Build Process

### Development Build
```bash
npm run build
npm start
```

### Docker Build
```bash
# Multi-stage build for optimization
docker build -t atabrinze-api .

# Build with specific target
docker build --target production -t atabrinze-api .
```

## 📊 Health Checks

### API Health Check
```bash
curl http://localhost:3000/api/health
```

### Database Health Check
```bash
# Test database connection
npm run db:validate
```

## 🔄 Database Migrations

### Development
```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset
```

### Production
```bash
# Deploy migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

## 🛠️ Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 PID
```

#### Database Connection Issues
```bash
# Check database status
npm run db:status

# Reset and migrate
npm run db:reset
npm run db:migrate
```

#### TypeScript Build Errors
```bash
# Clean build
rm -rf dist node_modules
npm install
npm run build
```

### Docker Issues
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t atabrinze-api .
```

## 📈 Performance Optimization

### Production Settings
- Enable gzip compression
- Use PM2 for process management
- Configure proper logging levels
- Set up monitoring (New Relic, DataDog)

### Database Optimization
- Add database indexes
- Enable connection pooling
- Configure proper timeout settings

## 🔒 Security Checklist

- [ ] Environment variables secured
- [ ] JWT secrets are strong
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] HTTPS enforced in production
- [ ] Database credentials secured

## 📝 Monitoring

### Logging
- Winston logs to files and console
- Log rotation configured
- Error tracking enabled

### Health Monitoring
- `/api/health` endpoint
- Database connection checks
- Memory and CPU monitoring

## 🚀 Quick Deploy Commands

### Local Development
```bash
npm install && npm run db:generate && npm run db:migrate && npm run dev
```

### Production Build
```bash
npm run build && npm start
```

### Docker Production
```bash
docker-compose up -d
```
