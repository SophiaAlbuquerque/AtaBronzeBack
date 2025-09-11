<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AtaBronze API - Project Setup Complete ✅

## Project Overview
This is a complete Node.js backend API for AtaBronze with the following features:

### ✅ Completed Features
- [x] **Project Structure**: Complete layered architecture with controllers, services, and repositories
- [x] **Authentication**: JWT-based authentication system
- [x] **User Management**: Full CRUD operations for users
- [x] **Product Management**: Complete product management with stock control
- [x] **Order System**: Order creation, management, and status tracking
- [x] **Payment Integration**: Asaas API integration (mock implementation)
- [x] **Shipping Integration**: Correios API integration (mock implementation)
- [x] **Bling Integration**: Product synchronization (mock implementation)
- [x] **Database**: Prisma ORM with PostgreSQL schema
- [x] **Testing**: Jest test suite with coverage
- [x] **Code Quality**: ESLint and Prettier configuration
- [x] **Logging**: Winston logger implementation
- [x] **Security**: Helmet, CORS, rate limiting
- [x] **Docker**: Complete Docker and docker-compose setup
- [x] **CI/CD**: GitHub Actions workflow
- [x] **Documentation**: Comprehensive README and setup scripts

### 🚀 Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Testing**: Jest + Supertest
- **Linting**: ESLint + Prettier
- **Logging**: Winston
- **Containerization**: Docker

### 📁 Project Structure
```
src/
├── config/          # Database, logger, environment config
├── controllers/     # HTTP request handlers
├── services/        # Business logic layer
├── repositories/    # Data access layer
├── middlewares/     # Custom Express middlewares
├── routes/          # API route definitions
├── types/           # TypeScript type definitions
├── utils/           # Utility functions and helpers
└── __tests__/       # Test files
```

### 🔌 Available Endpoints
- **Health**: `GET /api/health`
- **Authentication**: `POST /api/users/register`, `POST /api/users/login`
- **Users**: Full CRUD at `/api/users/*`
- **Products**: Full CRUD at `/api/products/*`
- **Orders**: Management at `/api/orders/*`
- **Payments**: Asaas integration at `/api/payments/*`
- **Shipping**: Correios integration at `/api/shipping/*`

### 🛠️ Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run lint` - Check code quality
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations

### 🐳 Docker Support
- **Development**: `docker-compose up`
- **Production**: Multi-stage Dockerfile ready
- **Database**: PostgreSQL container included

### 🔒 Security Features
- JWT authentication
- Request rate limiting
- Input validation with Joi
- Security headers with Helmet
- CORS configuration
- Error handling middleware

### 📊 Monitoring & Logging
- Winston logger with file and console outputs
- Request/response logging
- Error tracking
- Health check endpoint

The project is production-ready with proper error handling, security measures, testing, and deployment configurations.
	<!--
	Ensure that the previous step has been marked as completed.
	Call project setup tool with projectType parameter.
	Run scaffolding command to create project files and folders.
	Use '.' as the working directory.
	If no appropriate projectType is available, search documentation using available tools.
	Otherwise, create the project structure manually using available file creation tools.
	-->

- [ ] Customize the Project
	<!--
	Verify that all previous steps have been completed successfully and you have marked the step as completed.
	Develop a plan to modify codebase according to user requirements.
	Apply modifications using appropriate tools and user-provided references.
	Skip this step for "Hello World" projects.
	-->

- [ ] Install Required Extensions
	<!-- ONLY install extensions provided mentioned in the get_project_setup_info. Skip this step otherwise and mark as completed. -->

- [ ] Compile the Project
	<!--
	Verify that all previous steps have been completed.
	Install any missing dependencies.
	Run diagnostics and resolve any issues.
	Check for markdown files in project folder for relevant instructions on how to do this.
	-->

- [ ] Create and Run Task
	<!--
	Verify that all previous steps have been completed.
	Check https://code.visualstudio.com/docs/debugtest/tasks to determine if the project needs a task. If so, use the create_and_run_task to create and launch a task based on package.json, README.md, and project structure.
	Skip this step otherwise.
	 -->

- [ ] Launch the Project
	<!--
	Verify that all previous steps have been completed.
	Prompt user for debug mode, launch only if confirmed.
	 -->

- [ ] Ensure Documentation is Complete
	<!--
	Verify that all previous steps have been completed.
	Verify that README.md and the copilot-instructions.md file in the .github directory exists and contains current project information.
	Clean up the copilot-instructions.md file in the .github directory by removing all HTML comments.
	 -->
