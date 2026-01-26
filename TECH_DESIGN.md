# Technical Design Document: NEST-GAMES API

## 1. Overview

### 1.1 Purpose
NEST-GAMES is a RESTful API for managing video game records. It serves as an educational project demonstrating backend fundamentals using NestJS, TypeORM, and PostgreSQL.

### 1.2 Scope
- CRUD operations for game entities
- Input validation and error handling
- Database persistence with PostgreSQL
- Unit testing infrastructure

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────┐
│   Client    │
│  (Browser/  │
│   Postman)  │
└──────┬──────┘
       │ HTTP/REST
       │
┌──────▼─────────────────────────────────────┐
│         NestJS Application                 │
│  ┌──────────────────────────────────────┐ │
│  │  Express Adapter (HTTP Server)       │ │
│  └──────────────┬───────────────────────┘ │
│                 │                          │
│  ┌──────────────▼───────────────────────┐ │
│  │  Global ValidationPipe               │ │
│  │  (DTO validation, transformation)    │ │
│  └──────────────┬───────────────────────┘ │
│                 │                          │
│  ┌──────────────▼───────────────────────┐ │
│  │  GamesController                     │ │
│  │  (Route handlers, HTTP layer)        │ │
│  └──────────────┬───────────────────────┘ │
│                 │                          │
│  ┌──────────────▼───────────────────────┐ │
│  │  GamesService                        │ │
│  │  (Business logic, validation)        │ │
│  └──────────────┬───────────────────────┘ │
│                 │                          │
│  ┌──────────────▼───────────────────────┐ │
│  │  TypeORM Repository<Game>            │ │
│  │  (Data access abstraction)           │ │
│  └──────────────┬───────────────────────┘ │
└─────────────────┼──────────────────────────┘
                  │
                  │ SQL Queries
                  │
┌─────────────────▼──────────────────────────┐
│      PostgreSQL Database                   │
│  ┌──────────────────────────────────────┐ │
│  │  games table                         │ │
│  │  - id (UUID, PK)                     │ │
│  │  - title (TEXT)                      │ │
│  │  - genre (TEXT)                      │ │
│  │  - price (INT)                       │ │
│  │  - created_at (TIMESTAMP)            │ │
│  │  - updated_at (TIMESTAMP)            │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### 2.2 Layered Architecture

The application follows a **3-layer architecture**:

1. **Presentation Layer** (`Controller`)
   - Handles HTTP requests/responses
   - Route definitions
   - Parameter extraction
   - Status code management

2. **Business Logic Layer** (`Service`)
   - Business rules
   - Data validation
   - Error handling
   - Orchestration

3. **Data Access Layer** (`TypeORM Repository`)
   - Database operations
   - Query execution
   - Entity mapping

---

## 3. Technology Stack

### 3.1 Core Technologies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Runtime | Node.js | LTS | JavaScript runtime |
| Language | TypeScript | 5.0+ | Type-safe development |
| Framework | NestJS | 10.0+ | Progressive Node.js framework |
| HTTP Server | Express | (via NestJS) | Web server |
| ORM | TypeORM | 0.3.28 | Object-Relational Mapping |
| Database | PostgreSQL | 16 | Relational database |
| Validation | class-validator | 0.14+ | DTO validation |
| Testing | Jest | 30.2+ | Unit testing framework |
| Containerization | Docker | Latest | Database containerization |

### 3.2 Technology Rationale

**NestJS:**
- Built-in dependency injection
- Modular architecture
- Decorator-based syntax (familiar to Angular developers)
- Built-in support for TypeORM

**TypeORM:**
- Type-safe database queries
- Entity-based modeling
- Automatic migrations (dev mode)
- Repository pattern abstraction

**PostgreSQL:**
- ACID compliance
- Robust data integrity
- UUID support
- JSON capabilities (future extensibility)

**class-validator:**
- Declarative validation
- Decorator-based syntax
- Integration with NestJS ValidationPipe

---

## 4. Component Design

### 4.1 Module Structure

```
AppModule (Root)
├── TypeOrmModule (Database connection)
└── GamesModule (Feature module)
    ├── GamesController
    ├── GamesService
    └── Game Entity
```

### 4.2 Component Responsibilities

#### **AppModule**
- Root module configuration
- Global TypeORM connection setup
- Global validation pipe configuration
- Module imports

#### **GamesModule**
- Feature module for game management
- Registers `TypeOrmModule.forFeature([Game])`
- Exports controller and service

#### **GamesController**
- Defines REST endpoints
- Extracts request parameters
- Delegates to service layer
- Returns HTTP responses

#### **GamesService**
- Business logic implementation
- Data validation (beyond DTO validation)
- Error handling (NotFoundException, BadRequestException)
- Database operations via Repository

#### **Game Entity**
- TypeORM entity definition
- Database schema mapping
- Column definitions
- Timestamp management

---

## 5. API Design

### 5.1 Base URL
```
/api/v1
```

### 5.2 Endpoints

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/games` | List all games | 200 |
| GET | `/games/:id` | Get game by ID | 200, 404 |
| POST | `/games` | Create new game | 201, 400 |
| PATCH | `/games/:id` | Partial update | 200, 400, 404 |
| PUT | `/games/:id` | Full replace | 200, 400, 404 |
| DELETE | `/games/:id` | Delete game | 200, 404 |

### 5.3 Request/Response Examples

#### **GET /api/v1/games**
```http
GET /api/v1/games HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Hades",
    "genre": "Roguelike",
    "price": 1999,
    "created_at": "2026-01-25T10:00:00.000Z",
    "updated_at": "2026-01-25T10:00:00.000Z"
  }
]
```

#### **POST /api/v1/games**
```http
POST /api/v1/games HTTP/1.1
Content-Type: application/json

{
  "title": "Celeste",
  "genre": "Platformer",
  "price": 1999
}
```

**Response (201 Created):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "title": "Celeste",
  "genre": "Platformer",
  "price": 1999,
  "created_at": "2026-01-25T10:05:00.000Z",
  "updated_at": "2026-01-25T10:05:00.000Z"
}
```

#### **PATCH /api/v1/games/:id**
```http
PATCH /api/v1/games/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Content-Type: application/json

{
  "price": 2499
}
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

### 5.4 Error Responses

#### **400 Bad Request** (Validation Error)
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

#### **404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Game not found",
  "error": "Not Found"
}
```

---

## 6. Database Design

### 6.1 Entity Relationship Diagram

```
┌─────────────────┐
│     games       │
├─────────────────┤
│ id (UUID, PK)   │
│ title (TEXT)    │
│ genre (TEXT)    │
│ price (INT)     │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

### 6.2 Schema Definition

```sql
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  price INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 6.3 TypeORM Entity Mapping

```typescript
@Entity({ name: 'games' })
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text' })
  genre!: string;

  @Column({ type: 'int' })
  price!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at!: Date;
}
```

### 6.4 Indexes
- Primary key index on `id` (automatic)
- Consider adding index on `genre` if filtering becomes common
- Consider adding index on `created_at` for sorting

---

## 7. Request Flow

### 7.1 Create Game Flow (POST)

```
1. Client sends POST /api/v1/games with JSON body
   ↓
2. Express receives HTTP request
   ↓
3. NestJS router matches route to GamesController.create()
   ↓
4. ValidationPipe intercepts request
   - Transforms body to CreateGameDto instance
   - Validates using class-validator decorators
   - If invalid → returns 400 Bad Request
   ↓
5. Controller extracts DTO from body
   ↓
6. Controller calls gamesService.create(dto)
   ↓
7. Service creates Game entity from DTO
   ↓
8. Service calls repository.save(game)
   ↓
9. TypeORM generates INSERT SQL
   ↓
10. PostgreSQL executes INSERT
   ↓
11. PostgreSQL returns inserted row
   ↓
12. TypeORM maps result to Game entity
   ↓
13. Service returns Game entity
   ↓
14. Controller returns Game entity (NestJS serializes to JSON)
   ↓
15. Express sends 201 Created response
```

### 7.2 Get Game Flow (GET /:id)

```
1. Client sends GET /api/v1/games/:id
   ↓
2. NestJS router matches to GamesController.findOne()
   ↓
3. Controller extracts :id parameter
   ↓
4. Controller calls gamesService.findOne(id)
   ↓
5. Service calls repository.findOne({ where: { id } })
   ↓
6. TypeORM generates SELECT SQL
   ↓
7. PostgreSQL executes query
   ↓
8a. If found:
    - TypeORM maps to Game entity
    - Service returns Game
    - Controller returns 200 OK
8b. If not found:
    - Service throws NotFoundException
    - NestJS converts to 404 Not Found
```

---

## 8. Data Transfer Objects (DTOs)

### 8.1 CreateGameDto

**Purpose:** Validate input for game creation

**Validation Rules:**
- `title`: Required, must be non-empty string
- `genre`: Required, must be non-empty string
- `price`: Required, must be integer ≥ 0

**Implementation:**
```typescript
export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  genre!: string;

  @IsInt()
  @Min(0)
  price!: number;
}
```

### 8.2 UpdateGameDto

**Purpose:** Validate input for partial updates (PATCH)

**Validation Rules:**
- All fields optional
- If present, must match CreateGameDto rules

**Implementation:**
```typescript
export class UpdateGameDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;
}
```

---

## 9. Error Handling Strategy

### 9.1 Error Types

| Exception | HTTP Status | Use Case |
|-----------|-------------|----------|
| `BadRequestException` | 400 | Invalid input, empty PATCH body |
| `NotFoundException` | 404 | Resource not found |
| `InternalServerError` | 500 | Unexpected errors (default) |

### 9.2 Error Handling Flow

```
Exception thrown in Service
  ↓
NestJS Exception Filter catches it
  ↓
Converts to HTTP response
  ↓
Returns JSON with status code
```

### 9.3 Business Logic Validation

**PATCH Empty Body:**
```typescript
if (Object.keys(dto).length === 0) {
  throw new BadRequestException('No fields provided for update');
}
```

**Resource Not Found:**
```typescript
const game = await this.gamesRepo.findOne({ where: { id } });
if (!game) {
  throw new NotFoundException('Game not found');
}
```

---

## 10. Security Considerations

### 10.1 Current Implementation

- ✅ Input validation via DTOs
- ✅ SQL injection protection (TypeORM parameterized queries)
- ✅ Type safety (TypeScript)

### 10.2 Recommendations for Production

- [ ] Authentication (JWT tokens)
- [ ] Authorization (role-based access control)
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] HTTPS/TLS
- [ ] Input sanitization
- [ ] Environment variable security
- [ ] Database connection pooling limits
- [ ] Request size limits

---

## 11. Deployment Architecture

### 11.1 Development Environment

```
┌─────────────────────────────────┐
│  Developer Machine              │
│  ┌───────────────────────────┐ │
│  │  NestJS App (Node.js)     │ │
│  │  Port: 3000               │ │
│  └───────────┬───────────────┘ │
│              │                  │
│  ┌───────────▼───────────────┐ │
│  │  Docker Compose           │ │
│  │  ┌─────────────────────┐ │ │
│  │  │  PostgreSQL         │ │ │
│  │  │  Port: 5432         │ │ │
│  │  └─────────────────────┘ │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

### 11.2 Production Recommendations

```
┌─────────────┐
│   Load      │
│  Balancer   │
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
┌──▼──┐ ┌─▼──┐
│App  │ │App │  (Multiple instances)
│Inst │ │Inst│
└──┬──┘ └─┬──┘
   │      │
   └──┬───┘
      │
┌─────▼──────┐
│ PostgreSQL │
│  (Primary) │
└────────────┘
```

---

## 12. Testing Strategy

### 12.1 Unit Testing

**Scope:** Service layer logic

**Approach:**
- Mock TypeORM Repository
- Test business logic in isolation
- Verify error handling

**Example:**
```typescript
describe('GamesService', () => {
  it('findOne: should throw NotFoundException when game does not exist', async () => {
    const mockRepo = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const service = new GamesService(mockRepo as any);
    
    await expect(service.findOne('invalid-id'))
      .rejects.toBeInstanceOf(NotFoundException);
  });
});
```

### 12.2 Integration Testing (Future)

**Scope:** Controller + Service + Database

**Approach:**
- Use test database
- Test full request/response cycle
- Verify database state changes

### 12.3 E2E Testing (Future)

**Scope:** Full HTTP API

**Approach:**
- Use Supertest
- Test all endpoints
- Verify status codes and response bodies

---

## 13. Performance Considerations

### 13.1 Current Optimizations

- Connection pooling (TypeORM default)
- Indexed primary key
- Efficient queries (TypeORM generates optimized SQL)

### 13.2 Future Optimizations

- [ ] Pagination for GET /games
- [ ] Database query optimization
- [ ] Response caching (Redis)
- [ ] Database read replicas
- [ ] Connection pool tuning

---

## 14. Monitoring & Observability

### 14.1 Recommended Additions

- [ ] Request logging (Winston/Pino)
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (APM)
- [ ] Health check endpoint
- [ ] Database query logging (dev mode)

---

## 15. Future Enhancements

### 15.1 Planned Features

1. **Pagination**
   - Limit/offset or cursor-based
   - Default page size

2. **Filtering**
   - Filter by genre
   - Filter by price range

3. **Sorting**
   - Sort by price, title, created_at

4. **Search**
   - Full-text search on title/genre

5. **Swagger/OpenAPI**
   - API documentation
   - Interactive API explorer

6. **Authentication**
   - JWT-based auth
   - User management

---

## 16. Configuration Management

### 16.1 Environment Variables

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/games_db
PORT=3000
NODE_ENV=development
```

### 16.2 TypeORM Configuration

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Game],
  synchronize: true, // DEV ONLY - use migrations in production
})
```

---

## 17. Code Organization Principles

1. **Separation of Concerns**
   - Controllers handle HTTP
   - Services handle business logic
   - Repositories handle data access

2. **Single Responsibility**
   - Each class has one reason to change

3. **Dependency Injection**
   - Services injected via constructor
   - Enables testing and flexibility

4. **DRY (Don't Repeat Yourself)**
   - Shared DTOs
   - Reusable error handling

---

## Appendix A: Glossary

- **DTO**: Data Transfer Object - object used to transfer data between layers
- **ORM**: Object-Relational Mapping - technique for accessing databases
- **Repository Pattern**: Abstraction layer for data access
- **Dependency Injection**: Design pattern for providing dependencies

---

## Appendix B: References

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [class-validator Documentation](https://github.com/typestack/class-validator)
