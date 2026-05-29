# SmartPlan – Kostenlose Deployment-Anleitung

## Überblick

Dein Stack:
- **Frontend**: Next.js 16 → **Vercel** (kostenlos)
- **Datenbank**: PostgreSQL → **Supabase** (kostenlos, 500MB)
- **API**: NestJS → **Render** (kostenlos, 750h/Monat)
- **Solver**: Python FastAPI → **Render** (kostenlos)

## Schritt 1: GitHub Repository erstellen

```bash
cd "V17"

# Git initialisieren und commiten
git init
git add .
git commit -m "SmartPlan V17 - Initial commit"

# Auf GitHub erstellen (über GitHub.com oder CLI)
# Dann:
git remote add origin https://github.com/DEIN-USERNAME/SmartPlan.git
git push -u origin master
```

## Schritt 2: Supabase (Datenbank)

1. **supabase.com** → Account erstellen
2. **New Project** → Name: `smartplan`
3. Password merken!
4. Under **Settings → Database → Connection string → URI**:
   ```
   postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5&pool_timeout=10
   ```
5. Under **SQL Editor**: Migration ausführen (siehe unten)

### Migration in Supabase ausführen

In Supabase SQL Editor kopieren und ausführen:

```sql
-- Enums
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- Tabellen
CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT,
  "displayName" TEXT,
  "role" "UserRole" NOT NULL DEFAULT 'STUDENT'
);

CREATE TABLE "Teacher" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "userId" INTEGER UNIQUE REFERENCES "User"("id"),
  "name" TEXT NOT NULL
);

CREATE TABLE "Student" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "userId" INTEGER UNIQUE REFERENCES "User"("id"),
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "classId" INTEGER
);

CREATE TABLE "Class" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "year" INTEGER
);

CREATE TABLE "Room" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT UNIQUE NOT NULL,
  "capacity" INTEGER
);

CREATE TABLE "Subject" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "code" TEXT UNIQUE
);

CREATE TABLE "TimetableEntry" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "classId" INTEGER REFERENCES "Class"("id"),
  "subjectId" INTEGER NOT NULL REFERENCES "Subject"("id"),
  "teacherId" INTEGER REFERENCES "Teacher"("id"),
  "roomId" INTEGER REFERENCES "Room"("id"),
  "start" TIMESTAMPTZ NOT NULL,
  "end" TIMESTAMPTZ NOT NULL,
  "note" TEXT
);

CREATE TABLE "Substitution" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "date" TIMESTAMPTZ NOT NULL,
  "originalId" INTEGER NOT NULL REFERENCES "TimetableEntry"("id"),
  "substituteTeacherId" INTEGER REFERENCES "Teacher"("id"),
  "substituteRoomId" INTEGER REFERENCES "Room"("id"),
  "note" TEXT
);

CREATE TABLE "Attendance" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "timetableEntryId" INTEGER NOT NULL REFERENCES "TimetableEntry"("id"),
  "studentId" INTEGER NOT NULL REFERENCES "Student"("id"),
  "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
  "recordedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE("timetableEntryId", "studentId")
);

CREATE TABLE "Permission" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "User"("id"),
  "name" TEXT NOT NULL
);

-- Foreign Key für Student→Class
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey"
  FOREIGN KEY ("classId") REFERENCES "Class"("id");

-- Indexe
CREATE INDEX "TimetableEntry_classId_idx" ON "TimetableEntry"("classId");
CREATE INDEX "TimetableEntry_subjectId_idx" ON "TimetableEntry"("subjectId");
CREATE INDEX "TimetableEntry_teacherId_idx" ON "TimetableEntry"("teacherId");
```

Danach: **seed.sql** ausführen (oder Supabase Dashboard → SQL Editor → seed.sql hochladen).

## Schritt 3: Render (API + Solver)

1. **render.com** → Account erstellen (GitHub-Login)
2. **New → Web Service** → Repository verbinden
3. Einstellungen:
   - **Name**: `smartplan-api`
   - **Root Directory**: `backend/apps/api`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `node dist/main.js`
   - **Port**: 3001

4. **Environment Variables**:
   ```
   DATABASE_URL=postgresql://... (aus Supabase)
   JWT_SECRET=dein-super-geheimnis
   PORT=3001
   ```

5. Für den Solver: **New → Web Service** → Repo verbinden
   - **Name**: `smartplan-solver`
   - **Root Directory**: `backend/services/scheduler`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
   - **Port**: 8000

## Schritt 4: Vercel (Frontend)

1. **vercel.com** → Account erstellen (GitHub-Login)
2. **New Project** → Repository verbinden
3. Einstellungen:
   - **Root Directory**: `backend/apps/web`
   - **Framework Preset**: Next.js
   - **Build Command**: `npx next build`
   - **Output Directory**: `.next`

4. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://smartplan-api.onrender.com
   NEXT_PUBLIC_SOLVER_URL=https://smartplan-solver.onrender.com
   DATABASE_URL=postgresql://... (aus Supabase)
   JWT_SECRET=dein-super-geheimnis
   ```

5. **Deploy** klicken

## Schritt 5: Frontend-API-URL anpassen

In `lib/api.ts` die URL ändern:

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
```

In `app/login/page.tsx` die fetch-URL ändern:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
// ...
const response = await fetch(`${API_URL}/auth/login`, { ... });
```

## Kosten

| Service | Free Tier | Limit |
|---|---|---|
| Vercel | ✅ | 100GB Bandbreite/Monat |
| Supabase | ✅ | 500MB DB, 50k MAU |
| Render | ✅ | 750h/Monat (Spin-down nach 15min Inaktivität) |

**Hinweis**: Render-Services spin-down nach 15 Minuten Inaktivität runter. Beim ersten Request nach dem Spin-down dauert der Start ~30 Sekunden. Für eine Schulpräsentation reicht das völlig.

## Alternative: Alles auf einem Server

Wenn du einen eigenen Server hast (z.B. VPS für ~3€/Monat bei Hetzner):

```bash
# Alles mit Docker starten
git clone https://github.com/DEIN-USERNAME/SmartPlan.git
cd SmartPlan/backend
docker-compose up -d

# Frontend bauen und mit Nginx ausliefern
cd apps/web
npm run build
# Nginx konfigurieren für static files + API proxy
```
