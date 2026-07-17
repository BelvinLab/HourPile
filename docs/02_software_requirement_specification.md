Pour **HourPile**, le **Software Requirements Specification (SRS)** sera le document le plus important du projet. C'est le contrat entre l'idée et le développement : toutes les fonctionnalités découleront de ce document.

Je te propose une structure professionnelle inspirée de la norme **IEEE 29148**.

---

# HourPile

# Software Requirements Specification (SRS)

**Version:** 1.0

**Status:** Draft

**Author:** Belvin Tsadjio Muguel

**Date:** July 2026

---

# 1. Introduction

## 1.1 Purpose

This document specifies the functional and non-functional requirements of **HourPile**, a web application designed to help learners track their learning progress, build consistent study habits, and visualize their long-term improvement.

It serves as the primary reference for developers, designers, testers, and future contributors throughout the software development lifecycle.

---

## 1.2 Scope

HourPile is a learning progress tracking platform.

The MVP focuses on:

* User authentication
* Language management
* Learning session tracking
* Vocabulary management
* Statistics dashboard

Future versions will introduce social features, learning goals, gamification, AI-powered recommendations, and collaborative learning.

---

## 1.3 Definitions

| Term            | Definition                                    |
| --------------- | --------------------------------------------- |
| User            | A registered learner using HourPile           |
| Session         | A recorded learning activity                  |
| Language        | A language studied by a user                  |
| Vocabulary Word | A word saved by the learner                   |
| Dashboard       | Statistics page summarizing learning activity |
| MVP             | Minimum Viable Product                        |

---

# 2. Overall Description

## 2.1 Product Perspective

HourPile is a standalone web application composed of:

* React frontend
* FastAPI backend
* PostgreSQL database

---

## 2.2 Product Goals

The application aims to:

* encourage consistent learning
* help users monitor their progress
* centralize learning activities
* provide meaningful learning statistics

---

## 2.3 User Classes

### Visitor

Can:

* register
* login
* browse the landing page

---

### Learner

Can:

* manage profile
* manage languages
* record learning sessions
* manage vocabulary
* view dashboard

---

# 3. Functional Requirements

Each requirement receives a unique identifier.

---

## Authentication

### FR-001

The system shall allow visitors to create an account.

---

### FR-002

The system shall authenticate users using email and password.

---

### FR-003

The system shall allow authenticated users to update their profile.

---

## Language Management

### FR-004

Users shall be able to add one or more learning languages.

---

### FR-005

Users shall specify their current proficiency level.

---

### FR-006

Users shall specify a target proficiency level.

---

### FR-007

Users shall update or remove a language.

---

## Learning Sessions

### FR-008

Users shall record a learning session.

A learning session includes:

* language
* activity type
* duration
* date
* optional resource
* optional notes

---

### FR-009

Users shall edit existing sessions.

---

### FR-010

Users shall delete sessions.

---

### FR-011

Users shall view their session history.

---

### FR-012

Users shall filter sessions by:

* language
* activity
* period

---

## Dashboard

### FR-013

The system shall display:

* today's learning time
* weekly learning time
* monthly learning time
* total learning time

---

### FR-014

The system shall display learning time grouped by language.

---

### FR-015

The system shall display learning time grouped by activity.

---

## Vocabulary

### FR-016

Users shall add vocabulary words.

---

### FR-017

Users shall edit vocabulary words.

---

### FR-018

Users shall delete vocabulary words.

---

### FR-019

Users shall search vocabulary.

---

### FR-020

Users shall filter vocabulary by language.

---

# 4. Non-Functional Requirements

## Performance

NFR-001

95% of API requests shall complete within **300 ms** under normal load.

---

## Availability

NFR-002

The application shall target **99.5% availability**.

---

## Security

NFR-003

Passwords shall never be stored in plain text.

---

NFR-004

Passwords shall be hashed using **bcrypt**.

---

NFR-005

Authentication shall use JWT.

---

NFR-006

All communications shall use HTTPS in production.

---

## Scalability

NFR-007

The system shall support:

* 100,000 users
* millions of learning sessions

without architectural changes.

---

## Maintainability

NFR-008

The codebase shall follow Clean Architecture principles.

---

NFR-009

Database schema changes shall be managed exclusively through Alembic migrations.

---

## Compatibility

NFR-010

The application shall support:

* Chrome
* Firefox
* Edge
* Safari

---

## Accessibility

NFR-011

The application shall follow WCAG recommendations where applicable.

---

# 5. Business Rules

BR-001

A learning session must belong to exactly one user.

---

BR-002

A learning session must reference one existing language owned by the user.

---

BR-003

Learning duration must be greater than zero.

---

BR-004

Email addresses must be unique.

---

BR-005

Each vocabulary word belongs to one user.

---

BR-006

Users can study multiple languages simultaneously.

---

# 6. Constraints

* Backend: FastAPI
* ORM: SQLAlchemy 2
* Database: PostgreSQL 15
* Migrations: Alembic
* Frontend: React + TypeScript
* Docker-based development environment
* Git for version control

---

# 7. Assumptions

* Users have internet access.
* Users possess a valid email address.
* The application is intended for modern web browsers.

---

# 8. Acceptance Criteria

The MVP is considered complete when a learner can:

* create an account;
* log in securely;
* add one or more learning languages;
* record learning sessions;
* manage a personal vocabulary notebook;
* view learning statistics on a dashboard.

---

# 9. Future Requirements (Out of Scope for MVP)

These features are intentionally excluded from the MVP:

* Learning goals
* Daily streaks
* Social feed
* Resource sharing
* Comments
* Likes
* Followers
* Groups
* Notifications
* Challenges
* Gamification
* AI tutor
* AI recommendations
* Spaced repetition
* Premium subscription

---

# 10. Traceability Matrix

| Requirement ID  | Module            | Priority | MVP |
| --------------- | ----------------- | -------- | --- |
| FR-001 à FR-003 | Authentication    | High     | ✅   |
| FR-004 à FR-007 | Languages         | High     | ✅   |
| FR-008 à FR-012 | Learning Sessions | Critical | ✅   |
| FR-013 à FR-015 | Dashboard         | High     | ✅   |
| FR-016 à FR-020 | Vocabulary        | High     | ✅   |

---
