# Task Manager API

A simple CRUD project built with **NestJS**, featuring JWT-based authentication and a **PostgreSQL** database via **Prisma**. Built as a learning project to practice NestJS fundamentals, authentication, and database integration.

## Tech Stack

- **NestJS** – main backend framework
- **PostgreSQL** – database (running in Docker)
- **Prisma (v6)** – ORM for database access
- **JWT** (`@nestjs/jwt`, `passport-jwt`) – authentication
- **bcrypt** – password hashing
- **class-validator** – request validation (DTOs)

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/task_manager?schema=public"
JWT_SECRET="change-this-to-a-long-random-string"
JWT_EXPIRES_IN="1d"
PORT=3000
```

### 3. Start the database with Docker

```bash
docker compose up -d
```

> Note: the database port is set to `5433` (instead of the default `5432`) to avoid conflicts with a Postgres instance already installed on the host machine. This is configured via the `PGPORT` environment variable in `docker-compose.yml`.

### 4. Run the migration

```bash
npx prisma migrate dev --name init
```

### 5. Start the project

```bash
npm run start:dev
```

The server starts at `http://localhost:3000`.

## Folder Structure

```
task-manager-api/
├── docker-compose.yml
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   └── guards/
│   │       └── jwt-auth.guard.ts
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   ├── strategies/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   └── tasks/
│   │       ├── dto/
│   │       ├── tasks.controller.ts
│   │       ├── tasks.service.ts
│   │       └── tasks.module.ts
│   ├── app.module.ts
│   └── main.ts
└── .env
```

## Database Models

- **User**: `id`, `email`, `password` (hashed), `name`, `tasks[]`
- **Task**: `id`, `title`, `description`, `completed`, `userId` (owner)

Each user can only access their own tasks (enforced at the service layer).

## API Reference

### Auth

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Register a new user |
| POST | `/auth/login` | ❌ | Log in and receive a token |
| GET | `/auth/profile` | ✅ | Get the logged-in user's info |

**Register example:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"Test User"}'
```

**Login example:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

Both responses include an `access_token`, which must be sent on subsequent requests as:

```
Authorization: Bearer <access_token>
```

### Tasks

All routes below require a valid token.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/tasks` | Create a new task |
| GET | `/tasks` | List the current user's tasks |
| GET | `/tasks/:id` | Get a specific task |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

**Create task example:**

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Learn Nest","description":"Practice CRUD and Auth"}'
```

**Update task example:**

```bash
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"completed":true}'
```

## Useful Docker Commands

```bash
docker compose up -d              # start the database
docker compose down -v            # stop and remove all data
docker compose logs -f postgres   # follow live logs
npx prisma studio                 # view the database in a GUI
```

## Architecture Notes

- The project follows a **feature-based module** pattern: each feature (auth, tasks) owns its own module, while shared infrastructure (prisma, common) lives outside `modules/`.
- `PrismaModule` is marked `@Global()` so it doesn't need to be re-imported into every feature module.
- Business logic always lives in the `Service`; the `Controller` is only responsible for handling the request/response.