# Workshop Wizard - Full Stack Edition

Eine vollständige Workshop-Management-Anwendung mit separatem Backend und Frontend, inkl. User Management und Workshop-Persistierung.

## 🎯 Features

### Backend
- 🔐 **JWT-basierte Authentifizierung** - Sichere User-Sessions
- 👥 **User Management** - Registrierung, Login, Profilverwaltung
- 📝 **Workshop Management** - CRUD-Operationen für Workshops
- 💾 **SQLite Datenbank** - Einfache, dateibasierte Persistierung
- 🔒 **Sicheres Password Hashing** - bcrypt mit 10 Runden
- 🌐 **CORS-Support** - Konfigurierbar für verschiedene Umgebungen

### Frontend
- ⚛️ **React 18** - Moderne UI mit Hooks
- 🎨 **Tailwind CSS** - Responsive Design
- 🔄 **Auto-Save** - Automatisches Speichern zum Backend
- 📊 **ROI-Kalkulation** - Detaillierte Wirtschaftlichkeitsrechnung
- 📄 **PDF Export** - Professionelle Workshop-Berichte
- 🔍 **Workshop-Suche** - Einfaches Finden von Workshops
- 💾 **Multi-Workshop-Support** - Mehrere Workshops parallel verwalten

## 🚀 Quick Start

### Voraussetzungen
- Node.js 18+ und npm
- Git

### Installation & Start

1. **Repository klonen**
```bash
git clone <repository-url>
cd WorkshopWizard
```

2. **Backend starten**
```bash
cd backend
npm install
npm run dev
```
Das Backend läuft nun auf `http://localhost:3001`

3. **Frontend starten** (in einem neuen Terminal)
```bash
# Im Hauptverzeichnis
npm install
npm run dev
```
Das Frontend läuft nun auf `http://localhost:3000`

4. **Öffne die Anwendung**
```
http://localhost:3000
```

## 📁 Projekt-Struktur

```
WorkshopWizard/
├── backend/                    # Express Backend
│   ├── src/
│   │   ├── config/            # Datenbank-Konfiguration
│   │   ├── controllers/       # Request Handler
│   │   ├── middleware/        # Auth & Validation
│   │   ├── models/           # Datenbank Models
│   │   ├── routes/           # API Routes
│   │   ├── types/            # TypeScript Typen
│   │   ├── utils/            # Hilfsfunktionen
│   │   └── server.ts         # Server Entry Point
│   ├── data/                  # SQLite Datenbank
│   └── package.json
│
├── src/                       # React Frontend
│   ├── api/                  # API Client Layer
│   │   ├── client.js         # Axios Instance
│   │   ├── auth.js          # Auth API
│   │   └── workshops.js     # Workshop API
│   ├── components/
│   │   ├── auth/            # Login/Register
│   │   ├── steps/           # 8 Workshop Steps
│   │   ├── ui/              # Reusable UI Components
│   │   ├── Header.jsx
│   │   ├── Navigation.jsx
│   │   ├── ProgressBar.jsx
│   │   └── WorkshopList.jsx
│   ├── context/
│   │   ├── AuthContext.jsx   # User Authentication State
│   │   └── WorkshopContext.jsx  # Workshop State Management
│   ├── utils/               # Helper Functions
│   ├── App.jsx              # Main App Router
│   └── main.jsx             # Entry Point
│
└── README.md
```

## 🔧 Konfiguration

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
DATABASE_PATH=./data/workshop.db
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 📚 API Dokumentation

### Authentication Endpoints

#### Registrierung
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

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "Max",
    "last_name": "Mustermann",
    "company": "Beispiel GmbH"
  }
}
```

#### Profil abrufen
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Profil aktualisieren
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

### Workshop Endpoints

#### Workshop erstellen
```http
POST /api/workshops
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Mein Workshop",
  "data": { ... }  // Optional
}
```

#### Alle Workshops abrufen
```http
GET /api/workshops
Authorization: Bearer <token>
```

#### Workshop nach ID abrufen
```http
GET /api/workshops/:id
Authorization: Bearer <token>
```

#### Workshop aktualisieren
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

#### Workshop löschen
```http
DELETE /api/workshops/:id
Authorization: Bearer <token>
```

## 🎨 Workflow

1. **Registrierung/Login** - Benutzer erstellt Account oder meldet sich an
2. **Workshop-Liste** - Übersicht aller Workshops des Benutzers
3. **Workshop erstellen/auswählen** - Neuen Workshop starten oder bestehenden fortsetzen
4. **Workshop durchführen** - 8 Schritte zur Automatisierungs-Analyse
5. **Auto-Save** - Änderungen werden automatisch im Backend gespeichert
6. **Export** - PDF/JSON/CSV Export für Dokumentation

## 🔒 Sicherheit

- Passwörter werden mit bcrypt (10 Runden) gehasht
- JWT-Tokens für stateless Authentication
- CORS-Schutz konfiguriert
- SQL Injection Schutz durch Prepared Statements
- Foreign Key Constraints in der Datenbank
- Input Validation auf Server-Seite

## 🛠️ Entwicklung

### Backend Development
```bash
cd backend
npm run dev          # Start mit tsx watch (Hot Reload)
npm run build        # TypeScript kompilieren
npm start            # Production Start
```

### Frontend Development
```bash
npm run dev          # Vite Dev Server mit HMR
npm run build        # Production Build
npm run preview      # Preview Production Build
npm run lint         # ESLint Check
```

## 📦 Deployment

### Backend
1. `.env` Datei mit Production-Werten erstellen
2. `npm run build` ausführen
3. `node dist/server.js` oder Process Manager (PM2) nutzen

### Frontend
1. `.env` mit Production API URL erstellen
2. `npm run build` ausführen
3. `dist/` Ordner auf Webserver deployen (Nginx, Apache, Vercel, etc.)

## 🐛 Troubleshooting

### Backend startet nicht
- Prüfen ob Port 3001 frei ist: `lsof -i :3001`
- `.env` Datei existiert und korrekt konfiguriert ist
- Dependencies installiert: `npm install`

### Frontend kann nicht mit Backend kommunizieren
- Backend läuft: `curl http://localhost:3001/api/health`
- CORS konfiguration in Backend prüfen
- `VITE_API_URL` in Frontend `.env` korrekt

### Datenbank-Fehler
- `backend/data/` Ordner existiert und hat Schreibrechte
- Datenbank löschen und neu erstellen: `rm backend/data/workshop.db` und neu starten

## 📝 Lizenz

MIT

## 👥 Support

Bei Fragen oder Problemen, bitte ein Issue erstellen.

---

**Viel Erfolg mit Workshop Wizard! 🎉**
