# PawCare

A full-stack pet management application with Angular frontend and Spring Boot backend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21 + TypeScript |
| Backend | Java 17 + Spring Boot 4 |
| Database | MySQL 8.0 |
| DB UI | PhpMyAdmin |
| Auth | JWT |
| Containers | Docker + Docker Compose |

---

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ and npm
- [Java 17](https://adoptium.net/)
- [Maven](https://maven.apache.org/) (or use the included `mvnw` wrapper)
- [Docker](https://www.docker.com/) and Docker Compose

---

## Getting Started

### 1. Start the database with Docker

The database and PhpMyAdmin are managed via Docker Compose from the `back/` directory.

```bash
cd back
docker compose up -d
```

This starts:
- **MySQL 8.0** on port `3306` — database `pawcare`, user `pawcare` / `pawcare123`
- **PhpMyAdmin** on [http://localhost:8080](http://localhost:8080)

To stop the containers:

```bash
docker compose down
```

To stop and delete the database volume:

```bash
docker compose down -v
```

---

### 2. Run the backend

```bash
cd back
```

Copy the example environment file and fill in your JWT secret:

```bash
cp .env.example .env
```

`.env` content:

```env
JWT_SECRET=pawcare-secret-key-must-be-at-least-32-characters-long
JWT_EXPIRATION=86400000
```

Start the Spring Boot server:

```bash
./mvnw spring-boot:run
# or on Windows
mvnw.cmd spring-boot:run
```

The API is available at [http://localhost:8081](http://localhost:8081).

The database schema is auto-updated by Hibernate on startup.

---

### 3. Run the frontend

```bash
cd front
npm install
npm start
```

The app is available at [http://localhost:4200](http://localhost:4200).

---

## Project Structure

```
PawCare/
├── back/                   # Spring Boot API
│   ├── src/
│   │   └── main/java/com/pawCare/back/
│   │       ├── login/      # JWT authentication
│   │       ├── user/       # User management
│   │       └── pet/        # Pet management
│   ├── docker-compose.yml  # MySQL + PhpMyAdmin
│   ├── .env.example        # Environment variable template
│   └── pom.xml
└── front/                  # Angular SPA
    ├── src/app/
    │   ├── design-system/  # Reusable UI components
    │   ├── pages/          # Route components
    │   └── services/       # HTTP services (auth, ...)
    └── package.json
```

---

## Available Scripts

### Backend

| Command | Description |
|---|---|
| `./mvnw spring-boot:run` | Start dev server |
| `./mvnw test` | Run unit tests |
| `./mvnw package` | Build JAR |

### Frontend

| Command | Description |
|---|---|
| `npm start` | Start dev server (port 4200) |
| `npm run build` | Production build |
| `npm test` | Run unit tests (Vitest) |

---

## Ports Summary

| Service | Port | URL |
|---|---|---|
| Frontend (Angular) | 4200 | http://localhost:4200 |
| Backend (Spring Boot) | 8081 | http://localhost:8081 |
| PhpMyAdmin | 8080 | http://localhost:8080 |
| MySQL | 3306 | — |
