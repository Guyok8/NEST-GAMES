# NEST-GAMES API

A RESTful API for managing video game records, built with **NestJS**, **TypeScript**, **TypeORM**, and **PostgreSQL**.

This project demonstrates backend fundamentals with a focus on clean architecture, request flow, validation, database access using TypeORM, and unit testing.

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (LTS version recommended) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Docker** and **Docker Compose** - [Download](https://www.docker.com/get-started)

### Installation & Setup

#### 1. Clone the repository

```bash
git clone <your-repo-url>
cd NEST-GAMES
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Create environment file

Create a `.env` file in the root directory:

```bash
touch .env
```

Add the following content to `.env`:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/games_db
```

#### 4. Start the application

**Option A: Start everything with one command** (Recommended)

```bash
npm run dev
```

This command will:
1. Start PostgreSQL in Docker
2. Initialize the database (creates schema and seed data)
3. Install npm dependencies (if needed)
4. Start the NestJS API server

**Option B: Start components separately**

```bash
# Terminal 1: Start PostgreSQL
docker compose up -d

# Terminal 2: Start the API (after DB is ready)
npm run start
```

#### 5. Verify it's working

The API will be available at:
```
http://localhost:3000/api/v1
```

Test it with:
```bash
curl http://localhost:3000/api/v1/games
```

You should see a JSON response with game data.

---

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start PostgreSQL in Docker + install dependencies + start API |
| `npm run start` | Start the NestJS API server only (requires DB to be running) |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |

---

## 🛑 Stopping the Application

### Stop the API
Press `Ctrl+C` in the terminal where the API is running.

### Stop PostgreSQL
```bash
docker compose down
```

### Stop and remove all data (reset database)
```bash
docker compose down -v
```

This will remove the Docker volume, effectively resetting the database to its initial state.

---

## 🏗️ Tech Stack

- **Node.js** + **TypeScript** - Runtime and language
- **NestJS** 10.x - Progressive Node.js framework
- **TypeORM** 0.3.28 - Object-Relational Mapping
- **PostgreSQL** 16 - Relational database (Dockerized)
- **class-validator** - DTO validation
- **Jest** - Unit testing framework
- **Docker Compose** - Container orchestration

---

## 📁 Project Structure

```
NEST-GAMES/
├── docker/
│   └── init.sql              # Database initialization script
├── src/
│   ├── main.ts               # Application bootstrap
│   ├── app.module.ts         # Root module (TypeORM config)
│   ├── database/
│   │   ├── database.module.ts
│   │   └── database.service.ts  # (Legacy - not currently used)
│   └── games/
│       ├── dto/
│       │   ├── create-game.dto.ts
│       │   └── update-game.dto.ts
│       ├── game.entity.ts    # TypeORM entity definition
│       ├── games.controller.ts
│       ├── games.service.ts
│       ├── games.module.ts
│       └── games.service.spec.ts  # Unit tests
├── docker-compose.yml        # PostgreSQL container config
├── jest.config.cjs          # Jest configuration
├── package.json
├── tsconfig.json            # TypeScript configuration
└── README.md
```

---

## 🔌 API Endpoints

Base URL: `/api/v1`

### Get All Games

```http
GET /api/v1/games
```

**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Hades",
    "genre": "Roguelike",
    "price": 1999,
    "created_at": "2026-01-25T10:00:00.000Z",
    "updated_at": "2026-01-25T10:00:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Stardew Valley",
    "genre": "Farming",
    "price": 1499,
    "created_at": "2026-01-25T10:01:00.000Z",
    "updated_at": "2026-01-25T10:01:00.000Z"
  }
]
```

---

### Get Game by ID

```http
GET /api/v1/games/:id
```

**Example:**
```bash
curl http://localhost:3000/api/v1/games/550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Hades",
  "genre": "Roguelike",
  "price": 1999,
  "created_at": "2026-01-25T10:00:00.000Z",
  "updated_at": "2026-01-25T10:00:00.000Z"
}
```

**Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Game not found",
  "error": "Not Found"
}
```

---

### Create a Game

```http
POST /api/v1/games
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Celeste",
  "genre": "Platformer",
  "price": 1999
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/v1/games \
  -H "Content-Type: application/json" \
  -d '{"title":"Celeste","genre":"Platformer","price":1999}'
```

**Response (201 Created):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "title": "Celeste",
  "genre": "Platformer",
  "price": 1999,
  "created_at": "2026-01-25T10:05:00.000Z",
  "updated_at": "2026-01-25T10:05:00.000Z"
}
```

**Response (400 Bad Request) - Validation Error:**
```json
{
  "statusCode": 400,
  "message": [
    "title must be a string",
    "price must be an integer"
  ],
  "error": "Bad Request"
}
```

**Validation Rules:**
- `title`: Required, must be a non-empty string
- `genre`: Required, must be a non-empty string
- `price`: Required, must be an integer ≥ 0

---

### Update a Game (Partial Update)

```http
PATCH /api/v1/games/:id
Content-Type: application/json
```

**Request Body** (any subset of fields):
```json
{
  "price": 2499
}
```

**Example:**
```bash
curl -X PATCH http://localhost:3000/api/v1/games/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"price":2499}'
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Hades",
  "genre": "Roguelike",
  "price": 2499,
  "created_at": "2026-01-25T10:00:00.000Z",
  "updated_at": "2026-01-25T10:10:00.000Z"
}
```

**Response (400 Bad Request) - Empty Body:**
```json
{
  "statusCode": 400,
  "message": "No fields provided for update",
  "error": "Bad Request"
}
```

**Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Game not found",
  "error": "Not Found"
}
```

---

### Replace a Game (Full Update)

```http
PUT /api/v1/games/:id
Content-Type: application/json
```

**Request Body** (all fields required):
```json
{
  "title": "Hades II",
  "genre": "Roguelike",
  "price": 2999
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/v1/games/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"title":"Hades II","genre":"Roguelike","price":2999}'
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Hades II",
  "genre": "Roguelike",
  "price": 2999,
  "created_at": "2026-01-25T10:00:00.000Z",
  "updated_at": "2026-01-25T10:15:00.000Z"
}
```

**Response (400 Bad Request) - Missing Fields:**
```json
{
  "statusCode": 400,
  "message": [
    "title should not be empty",
    "genre should not be empty"
  ],
  "error": "Bad Request"
}
```

---

### Delete a Game

```http
DELETE /api/v1/games/:id
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/v1/games/550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**
```json
{
  "message": "Game removed successfully"
}
```

**Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Game not found",
  "error": "Not Found"
}
```

---

## 🗄️ Database

### Configuration

The database is configured via environment variables:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/games_db
```

**Connection Details:**
- Host: `localhost`
- Port: `5432`
- Database: `games_db`
- Username: `postgres`
- Password: `postgres`

### Schema

The `games` table structure:

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | Primary Key, Auto-generated |
| `title` | TEXT | NOT NULL |
| `genre` | TEXT | NOT NULL |
| `price` | INT | NOT NULL |
| `created_at` | TIMESTAMP | NOT NULL, Auto-set on creation |
| `updated_at` | TIMESTAMP | NOT NULL, Auto-updated |

### Initialization

On first run, Docker Compose automatically:
1. Creates the `games_db` database
2. Runs `docker/init.sql` to:
   - Enable UUID extension
   - Create the `games` table
   - Insert seed data (Hades, Stardew Valley)

### Accessing the Database Directly

Connect to PostgreSQL using any PostgreSQL client:

```bash
# Using psql (if installed)
psql postgres://postgres:postgres@localhost:5432/games_db

# Or using Docker
docker exec -it nest_games_db psql -U postgres -d games_db
```

---

## 🧪 Testing

### Run Unit Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Test Coverage

Tests are located in `*.spec.ts` files. The project includes unit tests for:

- `GamesService.findOne()` - Returns game when found, throws 404 when not found
- `GamesService.remove()` - Successfully deletes game, throws 404 when game doesn't exist

**Test Approach:**
- Uses Jest framework
- Mocks TypeORM Repository
- Tests business logic in isolation
- No database connection required

---

## 🏛️ Architecture

### Request Flow

```
Client Request
    ↓
Express HTTP Server
    ↓
NestJS Router
    ↓
Global ValidationPipe (validates DTOs)
    ↓
GamesController (HTTP layer)
    ↓
GamesService (Business logic)
    ↓
TypeORM Repository<Game> (Data access)
    ↓
PostgreSQL Database
    ↑
Response bubbles back up
```

### Layers

1. **Controller Layer** (`games.controller.ts`)
   - Handles HTTP requests/responses
   - Extracts parameters from requests
   - Delegates to service layer

2. **Service Layer** (`games.service.ts`)
   - Contains business logic
   - Validates business rules
   - Handles errors (NotFoundException, BadRequestException)
   - Uses TypeORM Repository for data access

3. **Entity Layer** (`game.entity.ts`)
   - Defines database schema
   - Maps to `games` table
   - TypeORM decorators define columns

4. **DTO Layer** (`dto/`)
   - Defines request/response shapes
   - Validation rules using class-validator
   - Type safety

---

## 🔧 Configuration

### TypeScript

Configuration in `tsconfig.json`:
- Target: ES2021
- Module: CommonJS
- Strict mode enabled
- Decorators enabled (required for NestJS/TypeORM)

### TypeORM

Configuration in `src/app.module.ts`:
- Connection via `DATABASE_URL` environment variable
- Entities: `[Game]`
- Synchronize: `true` (DEV ONLY - auto-creates tables)

⚠️ **Note:** `synchronize: true` is for development only. In production, use migrations.

### Validation

Global `ValidationPipe` configured in `src/main.ts`:
- `whitelist: true` - Strips non-whitelisted properties
- `forbidNonWhitelisted: true` - Throws error for extra properties
- `transform: true` - Transforms payloads to DTO instances

---

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process (replace PID with actual process ID)
kill -9 <PID>
```

### Database Connection Error

If you see connection errors:

1. **Check if PostgreSQL is running:**
   ```bash
   docker compose ps
   ```

2. **Check database logs:**
   ```bash
   docker compose logs postgres
   ```

3. **Restart PostgreSQL:**
   ```bash
   docker compose restart postgres
   ```

### Database Reset

To completely reset the database:

```bash
# Stop and remove containers and volumes
docker compose down -v

# Start fresh
docker compose up -d
```

### TypeScript Errors

If you see TypeScript compilation errors:

```bash
# Clean and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Learning Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [class-validator Documentation](https://github.com/typestack/class-validator)

---

## 🚧 Future Enhancements

Potential improvements:

- [ ] Pagination for GET /games
- [ ] Filtering (by genre, price range)
- [ ] Sorting options
- [ ] Search functionality
- [ ] Swagger/OpenAPI documentation
- [ ] Authentication & Authorization
- [ ] E2E tests
- [ ] Database migrations (replace synchronize)
- [ ] Rate limiting
- [ ] Request logging

---

## 📝 License

This project is for educational purposes.

---

## 👤 Author

Built as a hands-on learning project to understand backend fundamentals with NestJS and TypeORM.
