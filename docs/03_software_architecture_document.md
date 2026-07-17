Le **Software Architecture Document (SAD)** est le document qui répond à la question :

> **Comment HourPile est-il construit ?**

Il décrit l'architecture technique, les composants, les choix technologiques et les interactions entre eux. Voici une version professionnelle adaptée à HourPile.

---

# HourPile

# Software Architecture Document (SAD)

**Version:** 1.0

**Status:** Draft

**Author:** Belvin Tsadjio Muguel

**Date:** July 2026

---

# 1. Purpose

## 1.1 Objective

This document describes the software architecture of **HourPile**.

It defines the overall structure of the system, the technologies used, architectural decisions, and the interactions between components.

Its purpose is to ensure scalability, maintainability, security, and ease of future development.

---

# 2. Architectural Goals

The architecture has been designed to achieve the following objectives:

* Scalability
* Maintainability
* Modularity
* Security
* Performance
* Testability
* Extensibility

---

# 3. High-Level Architecture

HourPile follows a modern **client-server architecture**.

```text
                    User
                      │
                      ▼
          React + TypeScript Frontend
                      │
                 HTTPS / REST API
                      │
                      ▼
              FastAPI Backend
                      │
          SQLAlchemy ORM + Alembic
                      │
                      ▼
               PostgreSQL Database
```

Future external services may include:

* Email Service
* Object Storage
* Notification Service
* AI Recommendation Engine

---

# 4. Technology Stack

## Frontend

| Technology     | Purpose                 |
| -------------- | ----------------------- |
| React          | User Interface          |
| TypeScript     | Type safety             |
| Tailwind CSS   | Styling                 |
| React Router   | Routing                 |
| TanStack Query | Server state management |
| Axios          | HTTP client             |
| Recharts       | Charts & Analytics      |

---

## Backend

| Technology     | Purpose             |
| -------------- | ------------------- |
| FastAPI        | REST API            |
| SQLAlchemy 2   | ORM                 |
| Alembic        | Database migrations |
| Pydantic v2    | Validation          |
| Python Logging | Logging             |
| Pytest         | Testing             |

---

## Database

| Technology    | Purpose             |
| ------------- | ------------------- |
| PostgreSQL 15 | Relational database |

---

## Infrastructure

| Technology     | Purpose           |
| -------------- | ----------------- |
| Docker         | Containerization  |
| Docker Compose | Local development |
| GitHub Actions | CI/CD             |
| Render         | Backend hosting   |
| Vercel         | Frontend hosting  |

---

# 5. Architectural Style

The backend follows a layered architecture.

```text
Presentation Layer
        │
        ▼
API Layer
        │
        ▼
Service Layer
        │
        ▼
Repository Layer
        │
        ▼
Database
```

---

## Presentation Layer

Responsible for:

* User Interface
* Navigation
* Forms
* Charts

Technology:

React

---

## API Layer

Responsible for:

* HTTP Endpoints
* Request Validation
* Authentication
* Response Formatting

Technology:

FastAPI

---

## Service Layer

Contains all business logic.

Examples:

* Register User
* Record Learning Session
* Calculate Statistics
* Manage Vocabulary

---

## Repository Layer

Responsible for data persistence.

Only this layer communicates directly with the database.

Technology:

SQLAlchemy

---

## Database Layer

Stores application data.

Technology:

PostgreSQL

---

# 6. Project Structure

## Backend

```text
backend/
│
├── app/
│   ├── api/
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── repositories/
│   ├── services/
│   ├── schemas/
│   ├── dependencies/
│   ├── utils/
│   ├── middleware/
│   ├── tests/
│   └── main.py
│
├── alembic/
├── Dockerfile
├── pyproject.toml
└── docker-compose.yml
```

---

## Frontend

```text
frontend/
│
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── store/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   └── App.tsx
│
├── Dockerfile
└── package.json
```

---

# 7. Authentication Architecture

Authentication is based on **JWT (JSON Web Tokens)**.

```text
User Login
      │
      ▼
FastAPI Authentication
      │
      ▼
JWT Access Token
      │
      ▼
Protected API Requests
```

Passwords are hashed using **bcrypt**.

---

# 8. Data Flow

Example: Creating a Learning Session

```text
React Form
      │
      ▼
POST /learning-sessions
      │
      ▼
FastAPI Endpoint
      │
      ▼
LearningSessionService
      │
      ▼
LearningSessionRepository
      │
      ▼
PostgreSQL
```

---

# 9. Database Architecture

* PostgreSQL 15
* SQLAlchemy 2
* Alembic migrations
* UUID or integer primary keys (decision to be finalized)
* Foreign keys
* Indexes on frequently queried columns
* ACID transactions

---

# 10. Configuration Management

Environment variables:

```env
DATABASE_URL=
SECRET_KEY=
JWT_ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
```

Sensitive values are never committed to Git.

---

# 11. Logging

Application logs include:

* Authentication events
* API errors
* Unexpected exceptions
* Database errors

Structured logging is recommended for future integration with monitoring tools.

---

# 12. Error Handling

All API responses follow a consistent format.

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# 13. Security

The architecture includes:

* JWT authentication
* Password hashing with bcrypt
* HTTPS in production
* CORS configuration
* Input validation using Pydantic
* SQL injection protection through SQLAlchemy ORM
* Environment variables for secrets

Future enhancements:

* Rate limiting
* Refresh tokens
* Two-factor authentication (2FA)

---

# 14. Testing Strategy

Testing layers:

* Unit tests
* Integration tests
* API tests
* End-to-end tests (future)

Framework:

* Pytest

Target coverage:

* ≥ 80%

---

# 15. Deployment Architecture

Development:

```text
Docker Compose
│
├── frontend
├── backend
└── postgres
```

Production:

```text
User
 │
 ▼
Vercel (Frontend)
 │
 ▼
Render (FastAPI)
 │
 ▼
Managed PostgreSQL
```

---

# 16. Scalability

The architecture is designed to support future growth:

* Read replicas for PostgreSQL
* Redis caching
* Background jobs (Celery or Dramatiq)
* WebSockets for real-time features
* AI microservices
* Object storage (S3-compatible)
* Horizontal API scaling behind a load balancer

---

# 17. Architectural Decision Records (ADR)

| ADR     | Decision                              | Status   |
| ------- | ------------------------------------- | -------- |
| ADR-001 | FastAPI as backend framework          | Accepted |
| ADR-002 | React + TypeScript for frontend       | Accepted |
| ADR-003 | PostgreSQL 15 as primary database     | Accepted |
| ADR-004 | SQLAlchemy 2 as ORM                   | Accepted |
| ADR-005 | Alembic for schema migrations         | Accepted |
| ADR-006 | Docker for development and deployment | Accepted |
| ADR-007 | JWT for authentication                | Accepted |

