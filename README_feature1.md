# Wasel Palestine — Feature 1: Road Incidents & Checkpoint Management

**Wasel Palestine** is a smart mobility and checkpoint intelligence platform designed to help Palestinians navigate daily movement challenges. The system provides structured, reliable, and up-to-date mobility intelligence through a well-defined backend API.

---

## System Overview

Feature 1 provides a centralized registry for road checkpoints and incidents. It allows authorized users (admins/moderators) to manage checkpoints and incidents, while supporting full filtering, sorting, and pagination. The feature is built as a RESTful API using NestJS and MySQL.

---

## Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Framework | NestJS (Node.js) | Modular architecture, built-in dependency injection, TypeScript support, scalability |
| Database | MySQL + TypeORM | Relational data with ORM support and raw query capability |
| Auth | JWT (Access Token) | Stateless, scalable authentication |
| Rate Limiting | @nestjs/throttler | Protection against abuse and DDoS |
| Validation | class-validator | Request schema validation |

---

## Architecture

```
Client (Mobile / Web / API Consumer)
           │
           ▼
    ┌─────────────┐
    │  Auth Layer  │  JWT Guard + Roles Guard
    └──────┬──────┘
           │
    ┌──────▼──────────────────────┐
    │         NestJS API          │
    │  ┌────────────────────────┐ │
    │  │   IncidentController   │ │  /api/v1/incidents
    │  ├────────────────────────┤ │
    │  │  CheckpointController  │ │  /api/v1/checkpoints
    │  └────────────┬───────────┘ │
    └───────────────┼─────────────┘
                    │
           ┌────────▼────────┐
           │   MySQL Database │
           │  ┌────────────┐ │
           │  │ incidents  │ │
           │  │checkpoints │ │
           │  └────────────┘ │
           └─────────────────┘
```

---

## Database Schema (ERD)

### `checkpoints` table

| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, AUTO_INCREMENT |
| name | VARCHAR(255) | NOT NULL |
| latitude | DECIMAL(10,6) | NOT NULL |
| longitude | DECIMAL(10,6) | NOT NULL |
| current_status | ENUM('open','closed','busy') | DEFAULT 'open' |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | ON UPDATE NOW() |

### `incidents` table

| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, AUTO_INCREMENT |
| type | ENUM('closure','delay','accident','hazard','weather') | NOT NULL |
| severity | ENUM('low','medium','high') | NOT NULL |
| description | TEXT | NULL |
| status | ENUM('active','verified','resolved') | DEFAULT 'active' |
| checkpoint_id | INT | FK → checkpoints.id |
| latitude | DECIMAL(10,6) | NULL |
| longitude | DECIMAL(10,6) | NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | ON UPDATE NOW() |

**Relationships:**
- One `checkpoint` can have many `incidents` (1:N)
- `incidents.checkpoint_id` → `checkpoints.id`

---

## API Endpoints

All endpoints are versioned under `/api/v1/` and require JWT authentication unless stated otherwise.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | None | Register a new user |
| POST | `/auth/login` | None | Login and receive access token |

**Login Response:**
```json
{
  "access_token": "eyJhbGci..."
}
```

Use the token in all subsequent requests:
```
Authorization: Bearer <access_token>
```

---

### Incidents

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/incidents` | Any | List all incidents (paginated) |
| GET | `/api/v1/incidents/:id` | Any | Get incident by ID |
| POST | `/api/v1/incidents` | Admin/Moderator | Create new incident |
| PATCH | `/api/v1/incidents/:id` | Admin/Moderator | Update incident |
| DELETE | `/api/v1/incidents/:id` | Admin | Delete incident |
| PATCH | `/api/v1/incidents/:id/verify` | Moderator/Admin | Verify incident |
| PATCH | `/api/v1/incidents/:id/close` | Moderator/Admin | Close/resolve incident |

**Create Incident Request:**
```json
{
  "type": "hazard",
  "severity": "medium",
  "description": "Road blockage near checkpoint",
  "checkpoint_id": 2,
  "latitude": 31.96,
  "longitude": 35.94
}
```

**Incident Response:**
```json
{
  "id": 1,
  "type": "hazard",
  "severity": "medium",
  "description": "Road blockage near checkpoint",
  "status": "active",
  "checkpoint_id": 2,
  "latitude": "31.960000",
  "longitude": "35.940000",
  "created_at": "2026-04-15T10:00:00.000Z",
  "updated_at": "2026-04-15T10:00:00.000Z"
}
```

**List Response (Paginated):**
```json
{
  "data": [...],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

---

### Checkpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/checkpoints` | Any | List all checkpoints (paginated) |
| GET | `/api/v1/checkpoints/:id` | Any | Get checkpoint by ID |
| POST | `/api/v1/checkpoints` | Admin | Create new checkpoint |
| PATCH | `/api/v1/checkpoints/:id` | Admin/Moderator | Update checkpoint |
| DELETE | `/api/v1/checkpoints/:id` | Admin | Delete checkpoint |
| GET | `/api/v1/checkpoints/:id/history` | Any | Get checkpoint status history |

**Create Checkpoint Request:**
```json
{
  "name": "Checkpoint Alpha",
  "latitude": 31.95,
  "longitude": 35.93,
  "current_status": "open"
}
```

**Checkpoint Response:**
```json
{
  "id": 1,
  "name": "Checkpoint Alpha",
  "latitude": "31.950000",
  "longitude": "35.930000",
  "current_status": "open",
  "created_at": "2026-04-15T10:00:00.000Z",
  "updated_at": "2026-04-15T10:00:00.000Z"
}
```

---

## Error Formats

All errors follow a consistent format:

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad Request — validation error |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — insufficient role |
| 404 | Not Found — resource doesn't exist |
| 429 | Too Many Requests — rate limit exceeded |
| 500 | Internal Server Error |

---

## API Design Rationale

**Versioning (`/api/v1/`):** Enables future API evolution without breaking existing clients.

**RESTful conventions:** Standard HTTP methods (GET, POST, PATCH, DELETE) with resource-based URLs make the API intuitive and predictable.

**JWT Authentication:** Stateless tokens allow horizontal scaling without session storage. The 15-minute expiry provides security; for long-running processes, a fresh token should be obtained via login.

**Role-based access:** `admin` and `moderator` roles restrict write operations, ensuring data integrity.

**Pagination:** All list endpoints return `{ data, total, page, limit }` to prevent large payload responses.

**Rate Limiting:** `@nestjs/throttler` protects against abuse. Configured at 500 req/min globally, with per-endpoint overrides where needed.

---

## Testing Strategy

### Unit Tests
- Service layer tested with Jest
- Repository methods mocked using `jest.fn()`
- Controller tested independently from service

### Integration / Load Tests
- Tool: **k6**
- Scenarios: read-heavy, write-heavy, mixed, spike, soak
- Auth: Dynamic token obtained via `setup()` before each test run

### Running Load Tests

```bash
k6 run -e PASSWORD=your_password feature-1-performance.js
```

---

## Performance Testing Results

See [PERFORMANCE_REPORT.md](./PERFORMANCE_REPORT.md) for the full report.

**Summary:**

| Scenario | Result | Avg Response | p95 |
|----------|--------|-------------|-----|
| Read (5 VUs) | 100% ✓ | 14ms | 29ms |
| Write (3 VUs) | 100% ✓ | 14ms | 29ms |
| Soak (5 VUs / 2min) | 100% ✓ | 6.67ms | 14ms |
| Spike (50 VUs) | Partial* | 6.67ms | 14ms |

> *Spike failures are expected — rate limiter triggers by design at 50 concurrent users.

---

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Run tests
npm run test

# Run load tests
k6 run -e PASSWORD=your_password feature-1-performance.js
```

---

## Environment Variables

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_db_password
DB_NAME=wasel_db
JWT_SECRET=your_jwt_secret
```
