# Nest Games API

A simple backend API built with **NestJS**, **TypeScript**, **PostgreSQL**, and **Docker**.

This project demonstrates a clean backend architecture with:
- Feature-based structure (Games)
- PostgreSQL database running in Docker
- Automatic database initialization with seed data
- Simple REST API

---

## Features

- TypeScript + NestJS backend
- PostgreSQL database (Dockerized)
- Automatic DB schema + seed on first run
- REST API with JSON responses
- Example endpoint: `GET /games`

---

## Prerequisites

Make sure you have the following installed:

- **Node.js** (LTS recommended)
- **npm**
- **Docker** + **Docker Compose**

No global Nest CLI is required.

---

## Getting Started (One Command)

Clone the repository and run:

```bash
npm run dev
```

This single command will:

1. Start PostgreSQL using Docker
2. Automatically create the database schema
3. Seed the database with example games
4. Start the NestJS application

The application will be available at:

```
http://localhost:3000
```

---

## API

### Get all games

**Request**
```
GET /games
```

**Response**
```json
[
  {
    "id": "uuid",
    "title": "Hades",
    "genre": "Roguelike",
    "price": 1999,
    "created_at": "2026-01-18T10:00:00.000Z",
    "updated_at": "2026-01-18T10:00:00.000Z"
  },
  {
    "id": "uuid",
    "title": "Stardew Valley",
    "genre": "Farming",
    "price": 1499,
    "created_at": "2026-01-18T10:00:00.000Z",
    "updated_at": "2026-01-18T10:00:00.000Z"
  }
]
```

---

## Database

The database is PostgreSQL and runs inside Docker.

### Configuration
- **Database name:** `games_db`
- **Username:** `postgres`
- **Password:** `postgres`
- **Port:** `5432`

### Initialization
On the **first run only**, Docker automatically:
- Creates the `games` table
- Inserts two example games

This is handled by an SQL script mounted into the Postgres container.

---

## Project Structure

```
src/
  main.ts                # Application entry point
  app.module.ts          # Root module
  database/              # Database connection layer
    database.module.ts
    database.service.ts
  games/                 # Games feature
    games.module.ts
    games.controller.ts
    games.service.ts

docker/
  init.sql               # DB schema + seed data

docker-compose.yml       # Postgres container setup
```

---

## Scripts

```bash
npm run dev     # Start database + app
npm run start   # Start NestJS app only
```

---

## Stopping the App

Stop containers:
```bash
docker compose down
```

Reset database (delete all data):
```bash
docker compose down -v
```

---

## Notes

- This project is intentionally simple and educational
- No ORM is used — database access is done with plain SQL via `pg`
- Designed for beginners learning backend fundamentals

---

## Planned Next Steps

- GET /games/:id
- POST /games
- DELETE /games/:id
- Validation & error handling
