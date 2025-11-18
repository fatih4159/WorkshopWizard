# Workshop Wizard Backend API

Backend API für die Workshop Wizard Anwendung mit User Management und Workshop-Persistierung.

## Features

- 🔐 JWT-basierte Authentifizierung
- 👥 User Management (Register, Login, Profile)
- 📝 Workshop Management (CRUD Operationen)
- 💾 SQLite Datenbank
- 🔒 Sicheres Password Hashing mit bcrypt
- 🌐 CORS-Support für Frontend-Integration

## Installation

```bash
cd backend
npm install
```

## Konfiguration

1. Kopiere `.env.example` zu `.env`:
```bash
cp .env.example .env
```

2. Passe die Umgebungsvariablen an:
```env
PORT=3001
JWT_SECRET=dein-super-sicherer-secret-key
JWT_EXPIRES_IN=7d
DATABASE_PATH=./data/workshop.db
CORS_ORIGIN=http://localhost:3000
```

## Starten

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "Max",
  "lastName": "Mustermann",
  "company": "Beispiel GmbH"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Max",
  "lastName": "Mustermann",
  "company": "Neue Firma GmbH"
}
```

### Workshops

#### Create Workshop
```http
POST /api/workshops
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Mein Workshop",
  "data": { ... } // Optional: Workshop-Daten
}
```

#### Get All Workshops
```http
GET /api/workshops
Authorization: Bearer <token>
```

#### Get Workshop by ID
```http
GET /api/workshops/:id
Authorization: Bearer <token>
```

#### Update Workshop
```http
PUT /api/workshops/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Aktualisierter Titel",
  "data": { ... },
  "currentStep": 3,
  "isCompleted": false
}
```

#### Delete Workshop
```http
DELETE /api/workshops/:id
Authorization: Bearer <token>
```

## Datenbank Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Workshops Table
```sql
CREATE TABLE workshops (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  data TEXT NOT NULL,
  current_step INTEGER DEFAULT 1,
  is_completed BOOLEAN DEFAULT 0,
  last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Sicherheit

- Passwörter werden mit bcrypt gehasht (10 Runden)
- JWT-Tokens für Authentifizierung
- CORS-Schutz
- SQL Injection Schutz durch Prepared Statements
- Foreign Key Constraints aktiviert

## Entwicklung

Das Backend ist in TypeScript geschrieben und verwendet:
- Express.js für den Server
- better-sqlite3 für die Datenbank
- bcrypt für Password Hashing
- jsonwebtoken für JWT
- zod für Validierung

## Lizenz

MIT
