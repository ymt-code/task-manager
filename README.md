# Task Manager API

A scalable Task Management REST API built with NestJS, Prisma ORM, PostgreSQL, Docker, and JWT Authentication.

## Features

* User Registration
* User Authentication (JWT)
* Password Hashing with bcrypt
* Task CRUD Operations
* Input Validation
* PostgreSQL Database
* Prisma ORM
* Dockerized Database
* Modular NestJS Architecture

## Tech Stack

* NestJS
* TypeScript
* PostgreSQL
* Prisma ORM
* Docker
* JWT
* Passport
* bcrypt

## Project Structure

```text
src/
├── common/
├── config/
├── prisma/
├── modules/
│   ├── auth/
│   ├── users/
│   └── tasks/
├── app.module.ts
└── main.ts
```

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_manager"
JWT_SECRET="your-secret-key"
```

## Running PostgreSQL with Docker

```bash
docker compose up -d
```

## Prisma Commands

Generate Prisma Client:

```bash
npx prisma generate
```

Run Database Migrations:

```bash
npx prisma migrate dev --name init
```

Open Prisma Studio:

```bash
npx prisma studio
```

## Running the Application

Development:

```bash
npm run start:dev
```

Production:

```bash
npm run build
npm run start:prod
```

## API Modules

### Auth Module

* Register
* Login
* JWT Authentication

### Users Module

* User Management

### Tasks Module

* Create Task
* Get Tasks
* Update Task
* Delete Task

## License

MIT
