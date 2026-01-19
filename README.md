# Nest Games API

A simple backend API built with **NestJS**, **TypeScript**, **PostgreSQL**, and **Docker**.

This project is intentionally educational and demonstrates clean backend architecture, proper API behavior, validation, and database access using plain SQL.

---

## Tech Stack

- Node.js + TypeScript
- NestJS
- PostgreSQL (Dockerized)
- pg (no ORM)
- class-validator / class-transformer
- Docker Compose

---

## Features

- REST API with proper HTTP semantics
- API versioning (`/api/v1`)
- DTO-based validation
- Graceful error handling
- PostgreSQL with automatic schema + seed
- One-command startup for new developers

---

## Prerequisites

Make sure you have installed:

- Node.js (LTS)
- npm
- Docker + Docker Compose

No global Nest CLI required.

---

## Getting Started (One Command)

### 1️⃣ Clone the repository
```bash
git clone <your-repo-url>
cd nest-games
```

### 2️⃣ Create environment file
```bash
cp .env.example .env
```

### 3️⃣ Run the app
```bash
npm run dev
```

This command will:
1. Start PostgreSQL using Docker
2. Automatically create DB schema + seed data (first run only)
3. Start the NestJS API

The API will be available at:
```
http://localhost:3000
```

---

## Environment Variables

The app requires the following environment variable:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/games_db
```

See `.env.example` for reference.

---

## API Base URL

```
/api/v1
```

---

## API Endpoints

### Get all games
```
GET /api/v1/games
```

**200 OK**
```json
[
  {
    "id": "uuid",
    "title": "Hades",
    "genre": "Roguelike",
    "price": 1999,
    "created_at": "...",
    "updated_at": "..."
  }
]
```

---

### Get game by id
```
GET /api/v1/games/:id
```

- 200 OK → game found  
- 404 Not Found → game does not exist

---

### Create a game
```
POST /api/v1/games
```

**Request body**
```json
{
  "title": "Celeste",
  "genre": "Platformer",
  "price": 1999
}
```

**201 Created**
```json
{
  "id": "uuid",
  "title": "Celeste",
  "genre": "Platformer",
  "price": 1999,
  "created_at": "...",
  "updated_at": "..."
}
```

Validation errors return **400 Bad Request**.

---

### Update a game (partial)
```
PATCH /api/v1/games/:id
```

**Request body**
```json
{
  "price": 2499
}
```

Responses:
- 200 OK → updated game
- 400 Bad Request → empty or invalid body
- 404 Not Found → game does not exist

---

### Delete a game
```
DELETE /api/v1/games/:id
```

**200 OK**
```json
{
  "message": "Game removed successfully"
}
```

404 if the game does not exist.

---

## Database

- PostgreSQL runs in Docker
- Database: `games_db`
- User / Password: `postgres / postgres`
- Port: `5432`

### Initialization
On the first run only, Docker automatically:
- Creates the `games` table
- Inserts example games

This is handled by:
```
docker/init.sql
```

---

## Project Structure

```
src/
  main.ts                  # App bootstrap & global config
  app.module.ts            # Root module

  database/
    database.module.ts
    database.service.ts

  games/
    dto/
      create-game.dto.ts
      update-game.dto.ts
    games.controller.ts
    games.service.ts
    games.module.ts

docker/
  init.sql

docker-compose.yml
.env.example
```

---

## Scripts

```bash
npm run dev     # Start DB + API
npm run start   # Start API only
```

---

## Stopping the App

```bash
docker compose down
```

Reset database completely:
```bash
docker compose down -v
```

---

## Architecture Principles

- Controllers handle HTTP only
- DTOs validate input shape
- Services handle business logic
- Database access is isolated
- Validation happens before controllers

---

## Next Possible Improvements

- Authentication
- Pagination
- Soft deletes
- Tests
- Swagger / OpenAPI
- Logging middleware
