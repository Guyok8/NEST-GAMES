# Nest Games API

An educational backend API built with **NestJS**, **TypeScript**, **PostgreSQL**, and **Docker**.

This project was built step by step with the goal of **understanding backend fundamentals**, not just “making it work”.
It focuses on clear architecture, request flow, validation, database access, and testing.

---

## Tech Stack

- Node.js + TypeScript
- NestJS
- PostgreSQL (Dockerized)
- node-postgres (`pg`) – no ORM
- class-validator / class-transformer
- Jest (unit testing)
- Docker Compose

---

## Project Goals

- Learn how a real backend request flows end-to-end
- Understand separation of concerns (Controller / Service / DB)
- Handle validation and errors correctly
- Work with a real database
- Learn **unit testing** without magic or over-abstraction

---

## Architecture Overview

High-level request flow (POST / PATCH include validation):

```
Client
↓
Node.js HTTP Server
↓
Express Adapter
↓
Nest Router
↓
ValidationPipe (POST / PATCH only)
↓
Controller
↓
Service
↓
DatabaseService
↓
pg
↓
PostgreSQL
↑
(response bubbles back)
```

---

## Prerequisites

You need:

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

This will:
1. Start PostgreSQL in Docker
2. Initialize the database (schema + seed data)
3. Start the NestJS API

API will be available at:
```
http://localhost:3000/api/v1
```

---

## Environment Variables

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/games_db
```

See `.env.example`.

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

**Body**
```json
{
  "title": "Celeste",
  "genre": "Platformer",
  "price": 1999
}
```

- 201 Created → returns created game
- 400 Bad Request → validation error

---

### Update a game (partial update)
```
PATCH /api/v1/games/:id
```

**Body (any subset)**
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

### Replace a game (full update)
```
PUT /api/v1/games/:id
```

**Body (all fields required)**
```json
{
  "title": "New Title",
  "genre": "New Genre",
  "price": 3000
}
```

Responses:
- 200 OK → updated game
- 400 Bad Request → missing/invalid fields
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

## Validation & Error Handling

- DTOs define input shape
- `ValidationPipe` runs **before controllers**
- Business validation happens in services
- Errors are returned with proper HTTP status codes:
  - 400 – bad input
  - 404 – not found
  - 500 – unexpected errors

---

## Database

- PostgreSQL runs in Docker
- Initialized automatically on first run
- Schema and seed data are defined in:
```
docker/init.sql
```

---

## Project Structure

```
src/
  main.ts                  # App bootstrap
  app.module.ts            # Root module

  database/
    database.module.ts
    database.service.ts    # pg wrapper

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
jest.config.cjs
```

---

## Testing

### Unit Tests (Jest)

- Focus on **service logic**
- Database is mocked
- No HTTP server
- Fast and isolated

Run:
```bash
npm test
```

Example tested scenarios:
- `findOne()` returns game
- `findOne()` throws 404 when missing
- `remove()` success vs not found

---

## Scripts

```bash
npm run dev        # Start DB + API
npm run start      # Start API only
npm test           # Run unit tests
npm run test:watch # Run tests in watch mode
```

---

## Stopping the App

```bash
docker compose down
```

Reset DB completely:
```bash
docker compose down -v
```

---

## Learning Notes

This project intentionally:
- Avoids ORMs (TypeORM / Prisma)
- Uses raw SQL to understand DB behavior
- Separates validation from business logic
- Uses unit tests to verify logic, not infrastructure

---

## Possible Next Steps

- Add pagination to GET /games
- Add E2E tests
- Add Swagger (OpenAPI)
- Experiment with TypeORM in a separate branch

---

## Author

Built as a hands-on learning project to deeply understand backend fundamentals.
