Excellente idée. Le **Database Design Document (DDD)** est probablement le document le plus important après le SRS. Il ne s'agit pas seulement de lister les tables : il explique **comment les données sont organisées**, **pourquoi** elles le sont ainsi, et **quelles règles** garantissent leur cohérence.

Je te propose une version professionnelle.

---

# HourPile

# Database Design Document (DDD)

**Version:** 1.0

**Status:** Draft

**Author:** Belvin Tsadjio Muguel

**Date:** July 2026

---

# 1. Purpose

## 1.1 Objective

This document defines the logical and physical design of the HourPile database.

It describes:

* the data model;
* database entities and relationships;
* constraints;
* indexing strategy;
* normalization;
* migration strategy;
* future extensibility.

The goal is to provide a scalable, maintainable, and consistent relational database for the application.

---

# 2. Database Technology

| Item               | Decision       |
| ------------------ | -------------- |
| DBMS               | PostgreSQL 15  |
| ORM                | SQLAlchemy 2   |
| Migration Tool     | Alembic        |
| Development        | Docker Compose |
| Character Encoding | UTF-8          |
| Time Zone          | UTC            |

---

# 3. Design Principles

The database follows these principles:

* Third Normal Form (3NF)
* Referential Integrity
* ACID Transactions
* Explicit Foreign Keys
* Versioned Migrations
* Optimized Indexing
* Future Scalability

---

# 4. Naming Conventions

## Tables

Plural, snake_case

Examples:

```text
users
languages
learning_sessions
vocabulary_words
```

---

## Columns

snake_case

Examples

```text
first_name
target_level
created_at
updated_at
```

---

## Primary Keys

```text
id
```

---

## Foreign Keys

```text
user_id
language_id
```

---

## Timestamps

Every business table contains

```text
created_at
updated_at
```

---

# 5. Entity Overview

MVP Entities

```text
User

Language

UserLanguage

LearningSession

VocabularyWord
```

Future Entities

```text
Goal

Streak

Resource

Post

Comment

Like

Follow

Notification

Challenge

Group
```

---

# 6. Entity Definitions

## 6.1 User

Represents a registered learner.

| Field         | Type         | Constraints    |
| ------------- | ------------ | -------------- |
| id            | UUID         | PK             |
| first_name    | VARCHAR(100) | NOT NULL       |
| last_name     | VARCHAR(100) | NOT NULL       |
| email         | VARCHAR(255) | UNIQUE         |
| password_hash | TEXT         | NOT NULL       |
| avatar_url    | TEXT         | NULL           |
| timezone      | VARCHAR(50)  | UTC by default |
| created_at    | TIMESTAMP    | NOT NULL       |
| updated_at    | TIMESTAMP    | NOT NULL       |

---

## 6.2 Language

Represents a supported language.

| Field | Type         |
| ----- | ------------ |
| id    | UUID         |
| code  | VARCHAR(10)  |
| name  | VARCHAR(100) |

Examples

```text
en

fr

it

de

es
```

---

## 6.3 UserLanguage

Associative entity.

Represents one language studied by one user.

| Field         | Type |
| ------------- | ---- |
| id            | UUID |
| user_id       | FK   |
| language_id   | FK   |
| current_level | ENUM |
| target_level  | ENUM |

---

## 6.4 LearningSession

Represents one learning activity.

| Field            | Type      |
| ---------------- | --------- |
| id               | UUID      |
| user_id          | FK        |
| language_id      | FK        |
| activity         | ENUM      |
| duration_minutes | INTEGER   |
| session_date     | DATE      |
| resource         | TEXT      |
| notes            | TEXT      |
| created_at       | TIMESTAMP |

---

## 6.5 VocabularyWord

Represents one vocabulary entry.

| Field       | Type |
| ----------- | ---- |
| id          | UUID |
| user_id     | FK   |
| language_id | FK   |
| word        | TEXT |
| translation | TEXT |
| definition  | TEXT |
| example     | TEXT |
| category    | TEXT |

---

# 7. Relationships

```text
User
 │
 ├──────────────┐
 │              │
 ▼              ▼
LearningSession VocabularyWord
 │
 ▼
Language
 ▲
 │
UserLanguage
```

---

# 8. Cardinalities

| Relationship               | Cardinality |
| -------------------------- | ----------- |
| User → UserLanguage        | 1:N         |
| Language → UserLanguage    | 1:N         |
| User → LearningSession     | 1:N         |
| Language → LearningSession | 1:N         |
| User → VocabularyWord      | 1:N         |
| Language → VocabularyWord  | 1:N         |

---

# 9. Constraints

## User

* email must be unique
* password_hash cannot be null

---

## Learning Session

* duration > 0
* date required
* language required

---

## Vocabulary

* word required
* translation optional
* definition optional

---

## UserLanguage

Unique constraint

```text
(user_id, language_id)
```

A user cannot add the same language twice.

---

# 10. Enumerations

## LanguageLevel

```text
A1

A2

B1

B2

C1

C2
```

---

## ActivityType

```text
Reading

Listening

Speaking

Writing

Grammar

Vocabulary

Conversation

Movie

Podcast

Book

Course
```

---

# 11. Indexing Strategy

Indexes will be created for

| Table             | Columns      |
| ----------------- | ------------ |
| users             | email        |
| learning_sessions | user_id      |
| learning_sessions | language_id  |
| learning_sessions | session_date |
| vocabulary_words  | user_id      |
| vocabulary_words  | language_id  |

Composite indexes

```text
(user_id, session_date)

(user_id, language_id)
```

---

# 12. Data Integrity Rules

Examples

A LearningSession:

* must reference an existing user;
* must reference one of the user's languages;
* cannot have a negative duration.

A VocabularyWord:

* belongs to exactly one user;
* belongs to exactly one language.

---

# 13. Migration Strategy

All schema changes must be managed using Alembic.

Rules

* No manual schema changes in production.
* Every migration must be versioned.
* Every migration must be reversible whenever possible.
* Schema changes are committed alongside application code.

---

# 14. Backup Strategy

Development

No automated backups.

Production

* Daily backups
* 30-day retention
* Monthly restore test

---

# 15. Future Database Extensions

Additional tables

```text
goals

goal_progress

streaks

resources

posts

comments

likes

followers

notifications

groups

group_members

challenges

challenge_participants

achievements
```

---

# 16. Entity Relationship Diagram (ERD)

This section will contain the official ER diagram generated from the database model.

Recommended tools:

* Mermaid
* Draw.io
* DBeaver
* pgModeler
* dbdiagram.io

---

# 17. Database Versioning

Current Version

```text
Schema Version: 1.0
```

Future changes will be tracked using Alembic migrations and Git.

