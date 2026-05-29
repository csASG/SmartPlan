-- ============================================================
-- SmartPlan – Supabase Migration
-- Generiert aus schema.prisma (V17)
--
-- Führe dieses Script im Supabase SQL Editor aus:
-- https://supabase.com/dashboard/project/_/sql/new
-- ============================================================

-- ------------------------------------------------------------
-- 1. Enums
-- ------------------------------------------------------------

CREATE TYPE user_role AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- ------------------------------------------------------------
-- 2. Tabellen
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "User" (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    email         TEXT NOT NULL UNIQUE,
    password      TEXT,
    "displayName" TEXT,
    role          user_role NOT NULL DEFAULT 'STUDENT'
);

CREATE TABLE IF NOT EXISTS "Teacher" (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "userId"    BIGINT UNIQUE REFERENCES "User"(id) ON DELETE SET NULL,
    name        TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "Class" (
    id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    year INT
);

CREATE TABLE IF NOT EXISTS "Student" (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "userId"    BIGINT UNIQUE REFERENCES "User"(id) ON DELETE SET NULL,
    "firstName" TEXT NOT NULL,
    "lastName"  TEXT NOT NULL,
    "classId"   BIGINT REFERENCES "Class"(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "Room" (
    id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name     TEXT NOT NULL UNIQUE,
    capacity INT
);

CREATE TABLE IF NOT EXISTS "Subject" (
    id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS "TimetableEntry" (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "classId"   BIGINT REFERENCES "Class"(id) ON DELETE SET NULL,
    "subjectId" BIGINT NOT NULL REFERENCES "Subject"(id) ON DELETE CASCADE,
    "teacherId" BIGINT REFERENCES "Teacher"(id) ON DELETE SET NULL,
    "roomId"    BIGINT REFERENCES "Room"(id) ON DELETE SET NULL,
    start       TIMESTAMPTZ NOT NULL,
    "end"       TIMESTAMPTZ NOT NULL,
    note        TEXT
);

CREATE TABLE IF NOT EXISTS "Substitution" (
    id                     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "createdAt"            TIMESTAMPTZ NOT NULL DEFAULT now(),
    date                   TIMESTAMPTZ NOT NULL,
    "originalId"           BIGINT NOT NULL REFERENCES "TimetableEntry"(id) ON DELETE CASCADE,
    "substituteTeacherId"  BIGINT REFERENCES "Teacher"(id) ON DELETE SET NULL,
    "substituteRoomId"     BIGINT REFERENCES "Room"(id) ON DELETE SET NULL,
    note                   TEXT
);

CREATE TABLE IF NOT EXISTS "Attendance" (
    id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "createdAt"        TIMESTAMPTZ NOT NULL DEFAULT now(),
    "timetableEntryId" BIGINT NOT NULL REFERENCES "TimetableEntry"(id) ON DELETE CASCADE,
    "studentId"        BIGINT NOT NULL REFERENCES "Student"(id) ON DELETE CASCADE,
    status             attendance_status NOT NULL DEFAULT 'PRESENT',
    "recordedAt"       TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE ("timetableEntryId", "studentId")
);

CREATE TABLE IF NOT EXISTS "Permission" (
    id     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "userId" BIGINT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    name   TEXT NOT NULL
);

-- ------------------------------------------------------------
-- 3. Indizes (Performance)
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_timetable_class    ON "TimetableEntry"("classId");
CREATE INDEX IF NOT EXISTS idx_timetable_subject  ON "TimetableEntry"("subjectId");
CREATE INDEX IF NOT EXISTS idx_timetable_teacher  ON "TimetableEntry"("teacherId");
CREATE INDEX IF NOT EXISTS idx_timetable_start    ON "TimetableEntry"(start);
CREATE INDEX IF NOT EXISTS idx_timetable_range    ON "TimetableEntry"(start, "end");
CREATE INDEX IF NOT EXISTS idx_student_class      ON "Student"("classId");
CREATE INDEX IF NOT EXISTS idx_attendance_student ON "Attendance"("studentId");
CREATE INDEX IF NOT EXISTS idx_permission_user    ON "Permission"("userId");
CREATE INDEX IF NOT EXISTS idx_substitution_orig  ON "Substitution"("originalId");

-- ------------------------------------------------------------
-- 4. Automatisches updatedAt-Trigger
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_updated_at
    BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_teacher_updated_at
    BEFORE UPDATE ON "Teacher"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_student_updated_at
    BEFORE UPDATE ON "Student"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_timetable_updated_at
    BEFORE UPDATE ON "TimetableEntry"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ------------------------------------------------------------
-- 5. Row Level Security (RLS)
--
-- Standard: RLS ist AN bei Supabase.
-- Für Server-Side (Prisma mit Service Role) → RLS deaktivieren.
-- Für Client-Side (anon key) → Policies hinzufügen.
-- ------------------------------------------------------------

ALTER TABLE "User"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Teacher"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Student"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Class"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Room"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subject"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TimetableEntry"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Substitution"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Attendance"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Permission"      ENABLE ROW LEVEL SECURITY;

-- Policy: Service Role (über Prisma) umgeht RLS komplett.
-- Policy: Authenticated Users dürfen alles lesen.
CREATE POLICY "Authenticated read access"
    ON "TimetableEntry"
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated read access"
    ON "Class"
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated read access"
    ON "Teacher"
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated read access"
    ON "Student"
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated read access"
    ON "Room"
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated read access"
    ON "Subject"
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated read access"
    ON "Substitution"
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated read access"
    ON "Attendance"
    FOR SELECT
    TO authenticated
    USING (true);

-- Admin-Schreibpolicy
CREATE POLICY "Admin full access"
    ON "TimetableEntry"
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "User"
            WHERE "User".id = auth.uid()::bigint
              AND "User".role = 'ADMIN'
        )
    );

-- ------------------------------------------------------------
-- 6. Realtime aktivieren (für Supabase Realtime)
-- ------------------------------------------------------------

ALTER PUBLICATION supabase_realtime ADD TABLE "TimetableEntry";
ALTER PUBLICATION supabase_realtime ADD TABLE "Substitution";
ALTER PUBLICATION supabase_realtime ADD TABLE "Attendance";

-- ------------------------------------------------------------
-- 7. Seed-Daten (optional – gleicher Inhalt wie seed.ts)
-- ------------------------------------------------------------

-- Passwort: "secret" (bcrypt hash)
INSERT INTO "User" ("email", "password", "displayName", "role")
VALUES
    ('admin@example.com',   '$2a$10$rQEY1z6GxPz8gfHp1XbKOeQXz7e0gY8k5x7J5v8Q2z1X3C5B7N9K', 'Administrator', 'ADMIN'),
    ('teacher@example.com', '$2a$10$rQEY1z6GxPz8gfHp1XbKOeQXz7e0gY8k5x7J5v8Q2z1X3C5B7N9K', 'Teacher One',   'TEACHER'),
    ('student@example.com', '$2a$10$rQEY1z6GxPz8gfHp1XbKOeQXz7e0gY8k5x7J5v8Q2z1X3C5B7N9K', 'Student One',   'STUDENT')
ON CONFLICT (email) DO NOTHING;
