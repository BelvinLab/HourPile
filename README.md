# HourPile
 
Community-driven language learning platform: track your progress, build a vocabulary notebook, and see your statistics — all in one place. Spaced repetition and AI features are planned.
 
> **Status:** MVP backend complete (authentication, learning sessions, vocabulary). Frontend and AI features are in progress.
 
---
 
## Overview
 
Language learners today juggle many separate apps — video platforms for listening, flashcard apps for vocabulary, note tools for tracking. HourPile brings the essentials together: a place to log your study time, keep your vocabulary, and measure your progress consistently over time.
 
The long-term vision includes a social layer (sharing resources, following other learners, community challenges) and an AI layer (personalized recommendations, quiz generation, habit analysis). The current codebase focuses on a solid, well-structured backend foundation.
 
## Features
 
**Available now (MVP backend)**
 
- User registration and authentication (JWT)
- Declare the languages you are learning, with current and target levels
- Log learning sessions (duration, activity type, language, notes)
- List and review your own sessions
- Personal vocabulary notebook (add and list words)
**Planned**
 
- Learning statistics (daily / weekly / monthly time, breakdown by activity)
- Spaced repetition for vocabulary review
- Resource sharing and social feed
- Groups and community challenges
- AI: personalized recommendations, quiz generation, text correction, progress insights
## Tech stack
 
| Layer | Technology |
|-------|-----------|
| Backend | FastAPI (Python 3.12) |
| ORM | SQLAlchemy 2.0 |
| Migrations | Alembic |
| Database | PostgreSQL 15 |
| Auth | JWT (PyJWT) + bcrypt |
| Frontend | React + Vite *(planned)* |
| Tooling | Docker & Docker Compose |
 
## Architecture
 
The backend follows a clean, layered architecture where each layer has a single responsibility:
 
```
Request
  -> Route      (HTTP layer: receives, delegates, returns status codes)
  -> Schema     (Pydantic: validates input, filters output)
  -> Service    (business logic: create, verify, authenticate)
  -> Model      (SQLAlchemy: database tables)
  -> PostgreSQL
```
 
This separation keeps the code testable and easy to extend: routes never contain business logic, services never deal with HTTP, and models never know an API exists.
 
## Project structure
 
```
HourPile/
├── backend/
│   ├── app/
│   │   ├── core/          # config, database, security (hashing, JWT)
│   │   ├── models/        # SQLAlchemy models (tables)
│   │   ├── schemas/       # Pydantic schemas (API contracts)
│   │   ├── services/      # business logic
│   │   ├── routers/       # API endpoints
│   │   ├── dependencies/  # shared dependencies (get_current_user)
│   │   └── main.py        # app entry point
│   ├── alembic/           # database migrations
│   ├── scripts/           # seed scripts (reference data)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/              # React + Vite (planned)
├── docs/                  # project charter, SRS, architecture, DB design
├── docker-compose.yml
└── README.md
```
 
## Getting started
 
### Prerequisites
 
- [Docker](https://www.docker.com/) and Docker Compose
- Git
### Setup
 
1. **Clone the repository**
```bash
   git clone https://github.com/YOUR_USERNAME/HourPile.git
   cd HourPile
```
 
2. **Create your environment file**
   Copy the example and fill in your own values:
```bash
   cp .env.example .env
```
 
   Then edit `.env` — set `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and make sure `DATABASE_URL` uses the same values. Also set a `SECRET_KEY` (generate one with the command below).
 
```bash
   # generate a secure secret key
   python -c "import secrets; print(secrets.token_hex(32))"
```
 
3. **Start the stack**
```bash
   docker compose up --build
```
 
   This launches PostgreSQL and the FastAPI backend.
 
4. **Run the database migrations**
   In another terminal:
```bash
   docker compose exec backend alembic upgrade head
```
 
5. **Seed the reference data (languages)**
```bash
   docker compose exec backend python -m scripts.seed_languages
```
 
### Verify it works
 
- Health check: [http://localhost:8000/health](http://localhost:8000/health) should return `{"api":"ok","database":"ok"}`
- Interactive API docs: [http://localhost:8000/docs](http://localhost:8000/docs)
## API endpoints
 
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Create an account | No |
| POST | `/auth/login` | Log in, receive a JWT | No |
| POST | `/session/create` | Log a learning session | Yes |
| GET | `/session/my_session` | List your sessions | Yes |
| POST | `/vocabulary/create` | Add a word to your notebook | Yes |
| GET | `/vocabulary/my-vocabulary` | List your vocabulary | Yes |
 
Protected endpoints require a Bearer token. In `/docs`, use the **Authorize** button to log in, then call them directly.
 
## Documentation
 
Detailed project documents live in the [`docs/`](./docs) folder:
 
- Project Charter
- Software Requirements Specification
- Software Architecture Document
- Database Design Document
## Roadmap
 
- [x] Backend environment (Docker, PostgreSQL, Alembic)
- [x] Database schema and migrations
- [x] Authentication (JWT)
- [x] Learning sessions (CRUD)
- [x] Vocabulary notebook (CRUD)
- [ ] Statistics endpoints
- [ ] Spaced repetition
- [ ] Frontend (React + Vite)
- [ ] Social features
- [ ] AI features
## License
 
This project is currently developed for learning and portfolio purposes.
 
---
 
*Built as a full-stack learning project — from database design to a structured, secured API.*