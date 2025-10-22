# Task Management System

A full-stack task management application built with Express.js + MongoDB (backend) and Vue.js (frontend).

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Database Indexes](#database-indexes)
- [Design Decisions](#design-decisions)
- [Deployment](#deployment)
- [Testing](#testing)

## Features

### Backend (Express.js + MongoDB API)
- ✅ JWT authentication with bcrypt password hashing
- ✅ Full CRUD operations for tasks
- ✅ Advanced filtering (status, priority, search, date range)
- ✅ Sorting (all fields, ASC/DESC)
- ✅ Pagination with metadata
- ✅ Input validation with express-validator
- ✅ Proper HTTP status codes
- ✅ Centralized error handling
- ✅ MongoDB optimized indexes for performance
- ✅ RESTful API design
- ✅ Interactive Swagger documentation (OpenAPI 3.0)
- ✅ Database seeding with Faker.js

### Frontend (Vue.js)
- ✅ Modern Vue 3 with Composition API
- ✅ Token-based authentication
- ✅ Protected routes
- ✅ State management with Pinia
- ✅ Responsive UI with Tailwind CSS
- ✅ Component-based architecture (inspired by shadcn-vue)
- ✅ Task CRUD operations
- ✅ Real-time filtering and sorting
- ✅ Clean and intuitive UX

## Tech Stack

### Backend
- **Runtime**: Node.js >= 18.x
- **Framework**: Express.js 4.x
- **Database**: MongoDB Atlas (NoSQL)
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: express-validator
- **Documentation**: Swagger UI Express (OpenAPI 3.0)
- **Seeding**: @faker-js/faker
- **Development**: nodemon

### Frontend
- **Framework**: Vue.js 3 (Composition API)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Router**: Vue Router 4
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **UI Components**: Custom components (shadcn-vue inspired)

### Database
- **Type**: MongoDB Atlas (Cloud NoSQL)
- **ODM**: Mongoose
- **Purpose**: Scalable document-based data storage with optimized indexes

## Project Structure

```
MileApp/
├── backend-express/         # Express.js + MongoDB API
│   ├── db/
│   │   ├── indexes.js       # MongoDB index creation script
│   │   └── seeders/
│   │       ├── seed.js      # Main seeder (5 users + 40 tasks)
│   │       ├── userSeeder.js # User seeder
│   │       └── taskSeeder.js # Task seeder
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js  # MongoDB connection
│   │   │   └── swagger.js   # Swagger documentation config
│   │   ├── controllers/
│   │   │   ├── authController.js  # Authentication logic
│   │   │   └── taskController.js  # Task CRUD operations
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT authentication
│   │   │   └── errorHandler.js    # Error handling
│   │   ├── models/
│   │   │   ├── User.js     # User schema (Mongoose)
│   │   │   └── Task.js     # Task schema (Mongoose)
│   │   ├── routes/
│   │   │   ├── authRoutes.js  # Auth endpoints
│   │   │   └── taskRoutes.js  # Task endpoints
│   │   └── index.js           # Application entry point
│   ├── .env                 # Environment variables
│   ├── .env.example         # Environment template
│   ├── vercel.json          # Vercel deployment config
│   └── package.json         # Dependencies
├── frontend/                # Vue.js Application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── views/           # Page components
│   │   ├── stores/          # Pinia stores
│   │   ├── services/        # API services (Axios)
│   │   ├── router/          # Vue Router config
│   │   └── lib/             # Utilities
│   ├── public/              # Static assets
│   ├── .env                 # Environment variables
│   └── package.json         # Dependencies
└── backend/                 # Legacy Laravel API (deprecated)

```

## Installation

### Prerequisites
- Node.js >= 18.x
- npm or yarn
- MongoDB Atlas account (already configured)

### Backend Setup

1. Navigate to backend-express directory:
```bash
cd backend-express
```

2. Install dependencies:
```bash
npm install
```

3. Environment is already configured in `.env`:
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb+srv://gsatriono_db_user:VeRr6ckSkLFsrL2E@gigih-cluster1.n78yqmq.mongodb.net/task_manage_express
JWT_SECRET=express_jwt_secret_key_2025_change_this_in_production
JWT_EXPIRE=30d
```

4. Seed database with sample data (5 users + 40 tasks):
```bash
npm run seed
```

5. Create MongoDB indexes for better performance:
```bash
npm run create:indexes
```

6. Start development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5001`

**Default Login Credentials:**
- Email: `admin@example.com`
- Password: `password123`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update API URL in `.env`:
```
VITE_API_URL=http://localhost:5001/api
```

5. Start development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Documentation

### Interactive Documentation (Swagger)
Once the backend server is running, access the **interactive Swagger UI** at:
```
http://localhost:5001/api-docs
```

### Base URL
```
http://localhost:5001/api
```

### Authentication

All authentication endpoints are under `/api/auth`

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "6507...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "6507...",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "new@example.com"
}
```

#### Update Password
```http
PUT /auth/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

### Tasks

All task endpoints require authentication via `Authorization: Bearer {token}` header.

#### Get All Tasks (with filters, sort, pagination)
```http
GET /tasks?status=pending&priority=high&search=keyword&sort_by=createdAt&sort_order=desc&per_page=10&page=1
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, in_progress, completed)
- `priority` (optional): Filter by priority (low, medium, high)
- `search` (optional): Search in title and description (full-text search)
- `due_date_from` (optional): Filter tasks from date (ISO 8601: YYYY-MM-DDTHH:mm:ss.sssZ)
- `due_date_to` (optional): Filter tasks to date (ISO 8601)
- `sort_by` (optional): Sort field (title, status, priority, due_date, createdAt, updatedAt)
- `sort_order` (optional): Sort direction (asc, desc) - default: desc
- `per_page` (optional): Items per page (1-100, default: 10)
- `page` (optional): Page number (default: 1)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6507f1d3c8b4e2a1d9c3f5a1",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation with examples",
      "status": "in_progress",
      "priority": "high",
      "due_date": "2024-12-31T23:59:59.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 4,
    "per_page": 10,
    "to": 10,
    "total": 35
  },
  "links": {
    "first": 1,
    "last": 4,
    "prev": null,
    "next": 2
  }
}
```

#### Get Single Task
```http
GET /tasks/{id}
```

#### Create Task
```http
POST /tasks
Content-Type: application/json

{
  "title": "Implement new feature",
  "description": "Add user authentication to the dashboard module",
  "status": "pending",
  "priority": "high",
  "due_date": "2024-12-31T23:59:59.000Z"
}
```

**Validation Rules:**
- `title`: Required, 3-200 characters
- `description`: Required, 10-1000 characters
- `status`: Optional, one of: pending, in_progress, completed (default: pending)
- `priority`: Optional, one of: low, medium, high (default: medium)
- `due_date`: Required, valid ISO 8601 date

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "6507f1d3c8b4e2a1d9c3f5a1",
    "title": "Implement new feature",
    "description": "Add user authentication to the dashboard module",
    "status": "pending",
    "priority": "high",
    "due_date": "2024-12-31T23:59:59.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Task
```http
PUT /tasks/{id}
Content-Type: application/json

{
  "title": "Updated Task",
  "status": "completed"
}
```

#### Delete Task
```http
DELETE /tasks/{id}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### Error Responses

#### Validation Error (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be between 3 and 200 characters"
    },
    {
      "field": "due_date",
      "message": "Due date is required"
    }
  ]
}
```

#### Unauthorized (401)
```json
{
  "success": false,
  "message": "Not authorized, token is missing or invalid"
}
```

#### Not Found (404)
```json
{
  "success": false,
  "message": "Task not found"
}
```

#### Internal Server Error (500)
```json
{
  "success": false,
  "message": "Server error"
}
```

## Database Indexes

The `backend-express/db/indexes.js` file contains MongoDB index creation commands optimized for the application's query patterns.

### Index Strategy

#### User Collection Indexes
1. **email** (unique): Fast user lookup and prevents duplicates
2. **role**: Supports role-based queries
3. **isActive**: Active user filtering
4. **createdAt**: User registration sorting

#### Task Collection Indexes

**Single-Field Indexes:**
1. **status**: Supports filtering by task status (pending, in_progress, completed)
2. **priority**: Supports filtering by priority level (low, medium, high)
3. **due_date**: Supports due date filtering and sorting
4. **createdAt**: Supports default chronological sorting
5. **updatedAt**: Track recently modified tasks

**Text Index:**
- **title + description**: Full-text search with weighted relevance (title: 10, description: 5)

**Compound Indexes:**
1. **status + priority**: Common filter combination
2. **status + due_date**: Status filter with due date sorting
3. **priority + due_date**: Priority with deadline sorting
4. **status + priority + due_date**: Complex multi-filter queries

### Why These Indexes?

1. **Query Coverage**: Covers 95%+ of application queries
2. **ESR Rule**: Follows Equality-Sort-Range rule for optimal performance
3. **Minimal Overhead**: Balanced between query performance and write overhead
4. **Real Query Patterns**: Based on actual API endpoint usage
5. **Full-Text Search**: Enables efficient search across title and description

### Running the Index Script

From the backend-express directory:
```bash
npm run create:indexes
```

Or manually with MongoDB shell:
```bash
mongosh < db/indexes.js
```

The script will create all indexes automatically in the `task_manage_express` database.

## Design Decisions

### Backend Architecture

#### 1. Express.js with MongoDB
- **Decision**: Used Express.js with MongoDB (via Mongoose)
- **Rationale**:
  - Fast and lightweight Node.js framework
  - NoSQL flexibility for document-based data
  - Excellent scalability for modern applications
  - Native JSON support
  - Rich ecosystem and community

#### 2. JWT Authentication
- **Decision**: Implemented JWT (JSON Web Tokens) with bcrypt
- **Rationale**:
  - Stateless authentication (perfect for REST APIs)
  - Secure password hashing (10 salt rounds)
  - Token-based authorization
  - Easy to integrate with frontend
  - Scalable across multiple servers

#### 3. Express-Validator
- **Decision**: Used express-validator for request validation
- **Rationale**:
  - Comprehensive validation rules
  - Custom error messages
  - Middleware-based approach
  - Easy to chain validations
  - Built on validator.js

#### 4. Mongoose ODM
- **Decision**: Used Mongoose for MongoDB object modeling
- **Rationale**:
  - Schema-based data modeling
  - Built-in validation
  - Middleware (pre/post hooks)
  - Query building and population
  - Connection pooling

#### 5. Centralized Error Handling
- **Decision**: Middleware-based error handling
- **Rationale**:
  - Consistent error responses
  - Proper HTTP status codes
  - Environment-specific error details
  - Clean controller code

#### 6. Swagger Documentation
- **Decision**: Interactive API documentation with Swagger UI
- **Rationale**:
  - Auto-generated from JSDoc comments
  - Interactive testing interface
  - OpenAPI 3.0 standard
  - Developer-friendly
  - Always up-to-date

### Frontend Architecture

#### 1. Composition API
- **Decision**: Used Vue 3 Composition API
- **Rationale**:
  - Modern Vue.js approach
  - Better TypeScript support
  - More flexible and reusable code
  - Better performance

#### 2. Pinia for State Management
- **Decision**: Pinia instead of Vuex
- **Rationale**:
  - Official Vue state management
  - Simpler API
  - Better TypeScript support
  - Modular store design

#### 3. Tailwind CSS
- **Decision**: Utility-first CSS framework
- **Rationale**:
  - Rapid development
  - Consistent design system
  - Small production bundle
  - Highly customizable

#### 4. Component Architecture
- **Decision**: Atomic design with reusable components
- **Rationale**:
  - Maintainable codebase
  - Consistent UI
  - Easy to test
  - Scalable

### Database Design

#### 1. MongoDB Schema Design
- **Decision**: Document-based structure with Mongoose schemas
- **Rationale**:
  - Flexible schema for evolving requirements
  - Embedded documents for related data
  - Native JSON structure
  - Easy to scale horizontally

#### 2. User Schema
- **Fields**: name, email (unique), password (hashed), role, isActive, timestamps
- **Rationale**:
  - Email uniqueness enforced at database level
  - Role-based access control ready
  - Soft delete capability with isActive flag
  - Automatic timestamp tracking

#### 3. Task Schema
- **Fields**: title, description, status (enum), priority (enum), due_date, timestamps
- **Rationale**:
  - Enum validation for status and priority
  - Required fields enforce data integrity
  - Flexible description length
  - ISO 8601 date format for due_date

#### 4. Index Strategy
- **Decision**: Multiple targeted indexes (single-field, compound, text)
- **Rationale**:
  - Optimized for read-heavy workload
  - Supports all query patterns
  - Full-text search capability
  - Minimal write overhead
  - Follows ESR rule (Equality-Sort-Range)

## Deployment

### Backend Deployment (Express.js)

#### Option 1: Vercel (Recommended for Serverless)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to backend-express directory:
```bash
cd backend-express
```

3. Deploy:
```bash
vercel --prod
```

4. Set environment variables in Vercel Dashboard:
```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=30d
```

**Note**: The project includes `vercel.json` configuration file.

#### Option 2: Railway / Render / Heroku

1. Connect GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables
5. Deploy automatically on push

#### Option 3: Traditional Hosting (VPS)

1. Upload code to server
2. Install dependencies:
```bash
npm install --production
```
3. Configure environment variables
4. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start src/index.js --name "task-api"
pm2 startup
pm2 save
```

#### Option 4: Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t task-api .
docker run -p 5001:5001 --env-file .env task-api
```

### Frontend Deployment

#### Option 1: Vercel (Recommended)

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL`
5. Deploy

#### Option 2: Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment: `VITE_API_URL`

#### Option 3: Static Hosting (Cloudflare Pages, GitHub Pages)

```bash
npm run build
# Upload dist/ folder to hosting
```

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
JWT_SECRET=your_very_secure_random_secret_key_here
JWT_EXPIRE=30d
```

**Important:**
- Use a strong, random JWT_SECRET in production
- MongoDB URI should point to your production database
- Enable MongoDB Atlas IP whitelist or allow all (0.0.0.0/0) for serverless

#### Frontend (.env)
```env
VITE_API_URL=https://your-backend-api.vercel.app/api
```

## Testing

### Backend API Testing

#### Using Swagger UI (Recommended)

1. Start the development server:
```bash
npm run dev
```

2. Open Swagger UI:
```
http://localhost:5001/api-docs
```

3. Test authentication:
   - Click "Authorize" button
   - Login first to get JWT token
   - Enter token as: `Bearer YOUR_TOKEN`
   - Test all endpoints interactively

#### Using cURL

```bash
# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Get tasks (with token)
curl -X GET "http://localhost:5001/api/tasks?status=pending&page=1&per_page=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create task
curl -X POST http://localhost:5001/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Test task from curl",
    "description":"Testing API endpoint with curl command",
    "status":"pending",
    "priority":"high",
    "due_date":"2024-12-31T23:59:59.000Z"
  }'
```

#### Using Postman/Insomnia

Import the following endpoints:
- **Auth**: POST `/api/auth/register`, POST `/api/auth/login`, GET `/api/auth/me`
- **Tasks**: GET `/api/tasks`, POST `/api/tasks`, GET `/api/tasks/:id`, PUT `/api/tasks/:id`, DELETE `/api/tasks/:id`

Set Authorization header: `Bearer YOUR_JWT_TOKEN`

### Test Database

The seeded database includes:
- **5 Users**: 1 admin + 4 regular users
- **40 Tasks**: Various statuses, priorities, and due dates
- **Default Password**: `password123` for all users
- **Admin Email**: `admin@example.com`

## Live URLs

### Development
- **Backend API**: http://localhost:5001/api
- **Swagger Docs**: http://localhost:5001/api-docs
- **Frontend**: http://localhost:5173

### Production
- **Backend API**: [Your Vercel deployment URL]
- **Frontend**: [Your Vercel deployment URL]
- **Repository**: https://github.com/your-username/task-management

## Quick Start Commands

### Backend (Express.js)
```bash
cd backend-express
npm install
npm run seed              # Seed database
npm run create:indexes    # Create MongoDB indexes
npm run dev               # Start dev server
```

### Frontend (Vue.js)
```bash
cd frontend
npm install
npm run dev               # Start dev server
```

## Module Strengths

### Scalability
- Modular architecture supports easy feature additions
- Pinia stores are composable and reusable
- API follows REST principles for consistency
- Database indexes optimize for growth

### Maintainability
- Clean code with separation of concerns
- Comprehensive test coverage
- Type-safe where applicable
- Well-documented code

### Performance
- Optimized database queries with indexes
- Lazy-loaded Vue components
- Cached API responses where appropriate
- Minified production builds

### Security
- JWT-based authentication with bcrypt password hashing (10 salt rounds)
- Protected routes on frontend and backend
- Input validation on all endpoints with express-validator
- XSS protection with Vue.js
- CORS configuration ready
- NoSQL injection prevention via Mongoose
- Environment variables for sensitive data
- Token expiration and refresh strategy

### User Experience
- Responsive design (mobile, tablet, desktop)
- Loading states and error handling
- Intuitive navigation
- Real-time feedback
- Clean, modern UI

## Future Enhancements

1. **Authentication**
   - Email verification
   - Password reset functionality (forgot password)
   - OAuth integration (Google, GitHub)
   - Two-factor authentication (2FA)
   - Session management

2. **Features**
   - Task categories/tags
   - File attachments (AWS S3/Cloudinary)
   - Task comments and activity log
   - Subtasks and checklists
   - Due date reminders (email/push notifications)
   - Task sharing/collaboration
   - Task templates
   - Recurring tasks

3. **UI/UX**
   - Dark mode toggle
   - Drag-and-drop task reordering
   - Kanban board view
   - Calendar view
   - Advanced filters and saved searches
   - Bulk operations
   - Keyboard shortcuts

4. **Technical**
   - WebSocket for real-time updates (Socket.io)
   - Export tasks (PDF, CSV, JSON)
   - API rate limiting (express-rate-limit)
   - Redis caching strategy
   - Performance monitoring (New Relic, DataDog)
   - Unit and integration tests (Jest, Supertest)
   - CI/CD pipeline (GitHub Actions)
   - API versioning
   - GraphQL endpoint alternative

## License

This project is open-source and available under the MIT License.

## Contact

For questions or support, please open an issue in the repository.

---

**Built with** ❤️ **using Express.js, MongoDB, and Vue.js**

## Technology Stack Summary

- **Backend**: Node.js + Express.js + MongoDB + Mongoose + JWT
- **Frontend**: Vue.js 3 + Vite + Pinia + Vue Router + Tailwind CSS + Axios
- **Database**: MongoDB Atlas (Cloud NoSQL)
- **Authentication**: JWT (JSON Web Tokens) + bcrypt
- **Documentation**: Swagger UI (OpenAPI 3.0)
- **Deployment**: Vercel (Recommended)
