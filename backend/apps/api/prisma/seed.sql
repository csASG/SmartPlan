-- SmartPlan – Vollständiges Seed
-- Führe aus mit: psql -h localhost -p 5433 -U postgres -d railway -f seed.sql

-- ═══════════════════════════════════════════════════
-- 1. RÄUME (12 Stück)
-- ═══════════════════════════════════════════════════
INSERT INTO "Room" ("name", "capacity") VALUES
  ('R101', 30),
  ('R102', 28),
  ('R103', 32),
  ('R104', 30),
  ('R201', 28),
  ('R202', 26),
  ('R203', 30),
  ('Lab1', 24),
  ('Lab2', 24),
  ('PC1', 20),
  ('PC2', 20),
  ('Halle', 40),
  ('Kunst', 20),
  ('Musik', 22);

-- ═══════════════════════════════════════════════════
-- 2. FÄCHER (12 Stück)
-- ═══════════════════════════════════════════════════
INSERT INTO "Subject" ("name", "code") VALUES
  ('Mathematik', 'MATH'),
  ('Deutsch', 'DE'),
  ('Englisch', 'EN'),
  ('Physik', 'PHYS'),
  ('Chemie', 'CHEM'),
  ('Biologie', 'BIO'),
  ('Informatik', 'INF'),
  ('Geschichte', 'GES'),
  ('Geografie', 'GEO'),
  ('Sport', 'SPORT'),
  ('Kunst', 'KUNST'),
  ('Musik', 'MUS');

-- ═══════════════════════════════════════════════════
-- 3. KLASSEN (8 Klassen)
-- ═══════════════════════════════════════════════════
INSERT INTO "Class" ("name", "year") VALUES
  ('5A', 5),
  ('5B', 5),
  ('6A', 6),
  ('6B', 6),
  ('7A', 7),
  ('8A', 8),
  ('9A', 9),
  ('10A', 10);

-- ═══════════════════════════════════════════════════
-- 4. BENUTZER + LEHRER (10 Lehrer)
-- ═══════════════════════════════════════════════════

-- Admin
INSERT INTO "User" ("createdAt","updatedAt","email","password","displayName","role") VALUES
  (NOW(), NOW(), 'admin@smartplan.de', '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Admin User', 'ADMIN');

-- Lehrer-Users
INSERT INTO "User" ("createdAt","updatedAt","email","password","displayName","role") VALUES
  (NOW(), NOW(), 'schmidt@smartplan.de',   '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Dr. Martin Schmidt',   'TEACHER'),
  (NOW(), NOW(), 'mueller@smartplan.de',   '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Sabine Müller',        'TEACHER'),
  (NOW(), NOW(), 'weber@smartplan.de',     '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Thomas Weber',         'TEACHER'),
  (NOW(), NOW(), 'koch@smartplan.de',      '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Andreas Koch',         'TEACHER'),
  (NOW(), NOW(), 'braun@smartplan.de',     '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Stefan Braun',         'TEACHER'),
  (NOW(), NOW(), 'fischer@smartplan.de',   '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Claudia Fischer',      'TEACHER'),
  (NOW(), NOW(), 'lange@smartplan.de',     '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Petra Lange',          'TEACHER'),
  (NOW(), NOW(), 'hoffmann@smartplan.de',  '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Michael Hoffmann',     'TEACHER'),
  (NOW(), NOW(), 'wolf@smartplan.de',      '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Julia Wolf',           'TEACHER'),
  (NOW(), NOW(), 'becker@smartplan.de',    '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Klaus Becker',         'TEACHER');

-- Lehrer-Tabelleneinträge
INSERT INTO "Teacher" ("createdAt","updatedAt","userId","name") VALUES
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='schmidt@smartplan.de'),   'Dr. Martin Schmidt'),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='mueller@smartplan.de'),   'Sabine Müller'),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='weber@smartplan.de'),     'Thomas Weber'),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='koch@smartplan.de'),      'Andreas Koch'),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='braun@smartplan.de'),     'Stefan Braun'),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='fischer@smartplan.de'),   'Claudia Fischer'),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='lange@smartplan.de'),     'Petra Lange'),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='hoffmann@smartplan.de'),  'Michael Hoffmann'),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='wolf@smartplan.de'),      'Julia Wolf'),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='becker@smartplan.de'),    'Klaus Becker');

-- ═══════════════════════════════════════════════════
-- 5. SCHÜLER (32 Stück, verteilt auf Klassen)
-- ═══════════════════════════════════════════════════

-- 5A (4 Schüler)
INSERT INTO "User" ("createdAt","updatedAt","email","password","displayName","role") VALUES
  (NOW(), NOW(), 'mueller.lena@schule.de',    '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Lena Müller',      'STUDENT'),
  (NOW(), NOW(), 'schneider.tim@schule.de',   '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Tim Schneider',    'STUDENT'),
  (NOW(), NOW(), 'fischer.jana@schule.de',    '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Jana Fischer',     'STUDENT'),
  (NOW(), NOW(), 'weber.max@schule.de',       '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Max Weber',        'STUDENT');

INSERT INTO "Student" ("createdAt","updatedAt","userId","firstName","lastName","classId") VALUES
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='mueller.lena@schule.de'),   'Lena',   'Müller',    (SELECT id FROM "Class" WHERE name='5A')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='schneider.tim@schule.de'),  'Tim',    'Schneider', (SELECT id FROM "Class" WHERE name='5A')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='fischer.jana@schule.de'),   'Jana',   'Fischer',   (SELECT id FROM "Class" WHERE name='5A')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='weber.max@schule.de'),      'Max',    'Weber',     (SELECT id FROM "Class" WHERE name='5A'));

-- 5B (4 Schüler)
INSERT INTO "User" ("createdAt","updatedAt","email","password","displayName","role") VALUES
  (NOW(), NOW(), 'hoffmann.sophie@schule.de', '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Sophie Hoffmann',  'STUDENT'),
  (NOW(), NOW(), 'koch.felix@schule.de',      '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Felix Koch',       'STUDENT'),
  (NOW(), NOW(), 'wolf.emma@schule.de',       '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Emma Wolf',        'STUDENT'),
  (NOW(), NOW(), 'braun.leon@schule.de',      '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Leon Braun',       'STUDENT');

INSERT INTO "Student" ("createdAt","updatedAt","userId","firstName","lastName","classId") VALUES
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='hoffmann.sophie@schule.de'), 'Sophie', 'Hoffmann', (SELECT id FROM "Class" WHERE name='5B')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='koch.felix@schule.de'),      'Felix',  'Koch',     (SELECT id FROM "Class" WHERE name='5B')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='wolf.emma@schule.de'),       'Emma',   'Wolf',     (SELECT id FROM "Class" WHERE name='5B')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='braun.leon@schule.de'),      'Leon',   'Braun',    (SELECT id FROM "Class" WHERE name='5B'));

-- 6A (4 Schüler)
INSERT INTO "User" ("createdAt","updatedAt","email","password","displayName","role") VALUES
  (NOW(), NOW(), 'lange.mia@schule.de',       '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Mia Lange',        'STUDENT'),
  (NOW(), NOW(), 'becker.noah@schule.de',     '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Noah Becker',      'STUDENT'),
  (NOW(), NOW(), 'schmidt.hanna@schule.de',   '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Hanna Schmidt',    'STUDENT'),
  (NOW(), NOW(), 'mueller.ben@schule.de',     '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Ben Müller',       'STUDENT');

INSERT INTO "Student" ("createdAt","updatedAt","userId","firstName","lastName","classId") VALUES
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='lange.mia@schule.de'),      'Mia',    'Lange',    (SELECT id FROM "Class" WHERE name='6A')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='becker.noah@schule.de'),    'Noah',   'Becker',   (SELECT id FROM "Class" WHERE name='6A')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='schmidt.hanna@schule.de'),  'Hanna',  'Schmidt',  (SELECT id FROM "Class" WHERE name='6A')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='mueller.ben@schule.de'),    'Ben',    'Müller',   (SELECT id FROM "Class" WHERE name='6A'));

-- 6B (4 Schüler)
INSERT INTO "User" ("createdAt","updatedAt","email","password","displayName","role") VALUES
  (NOW(), NOW(), 'weber.laura@schule.de',     '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Laura Weber',      'STUDENT'),
  (NOW(), NOW(), 'wolf.jonas@schule.de',      '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Jonas Wolf',       'STUDENT'),
  (NOW(), NOW(), 'fischer.sarah@schule.de',   '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Sarah Fischer',    'STUDENT'),
  (NOW(), NOW(), 'koch.david@schule.de',      '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'David Koch',       'STUDENT');

INSERT INTO "Student" ("createdAt","updatedAt","userId","firstName","lastName","classId") VALUES
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='weber.laura@schule.de'),    'Laura',  'Weber',    (SELECT id FROM "Class" WHERE name='6B')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='wolf.jonas@schule.de'),     'Jonas',  'Wolf',     (SELECT id FROM "Class" WHERE name='6B')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='fischer.sarah@schule.de'),  'Sarah',  'Fischer',  (SELECT id FROM "Class" WHERE name='6B')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='koch.david@schule.de'),     'David',  'Koch',     (SELECT id FROM "Class" WHERE name='6B'));

-- 7A (4 Schüler)
INSERT INTO "User" ("createdAt","updatedAt","email","password","displayName","role") VALUES
  (NOW(), NOW(), 'hoffmann.paul@schule.de',   '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Paul Hoffmann',    'STUDENT'),
  (NOW(), NOW(), 'braun.clara@schule.de',     '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Clara Braun',      'STUDENT'),
  (NOW(), NOW(), 'lange.lukas@schule.de',     '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Lukas Lange',      'STUDENT'),
  (NOW(), NOW(), 'becker anna@schule.de',     '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Anna Becker',      'STUDENT');

INSERT INTO "Student" ("createdAt","updatedAt","userId","firstName","lastName","classId") VALUES
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='hoffmann.paul@schule.de'),  'Paul',   'Hoffmann', (SELECT id FROM "Class" WHERE name='7A')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='braun.clara@schule.de'),    'Clara',  'Braun',    (SELECT id FROM "Class" WHERE name='7A')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='lange.lukas@schule.de'),    'Lukas',  'Lange',    (SELECT id FROM "Class" WHERE name='7A')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='becker anna@schule.de'),    'Anna',   'Becker',   (SELECT id FROM "Class" WHERE name='7A'));

-- 8A (4 Schüler)
INSERT INTO "User" ("createdAt","updatedAt","email","password","displayName","role") VALUES
  (NOW(), NOW(), 'wolf.niklas@schule.de',     '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Niklas Wolf',      'STUDENT'),
  (NOW(), NOW(), 'schmidt.lea@schule.de',     '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Lea Schmidt',      'STUDENT'),
  (NOW(), NOW(), 'mueller.finn@schule.de',    '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Finn Müller',      'STUDENT'),
  (NOW(), NOW(), 'koch.maja@schule.de',       '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Maja Koch',        'STUDENT');

INSERT INTO "Student" ("createdAt","updatedAt","userId","firstName","lastName","classId") VALUES
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='wolf.niklas@schule.de'),    'Niklas', 'Wolf',     (SELECT id FROM "Class" WHERE name='8A')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='schmidt.lea@schule.de'),    'Lea',    'Schmidt',  (SELECT id FROM "Class" WHERE name='8A')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='mueller.finn@schule.de'),   'Finn',   'Müller',   (SELECT id FROM "Class" WHERE name='8A')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='koch.maja@schule.de'),      'Maja',   'Koch',     (SELECT id FROM "Class" WHERE name='8A'));

-- 9A (4 Schüler)
INSERT INTO "User" ("createdAt","updatedAt","email","password","displayName","role") VALUES
  (NOW(), NOW(), 'fischer.elena@schule.de',   '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Elena Fischer',    'STUDENT'),
  (NOW(), NOW(), 'braun.marcel@schule.de',    '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Marcel Braun',     'STUDENT'),
  (NOW(), NOW(), 'lange.sophie@schule.de',    '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Sophie Lange',     'STUDENT'),
  (NOW(), NOW(), 'weber.kilian@schule.de',    '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Kilian Weber',     'STUDENT');

INSERT INTO "Student" ("createdAt","updatedAt","userId","firstName","lastName","classId") VALUES
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='fischer.elena@schule.de'),  'Elena',  'Fischer',  (SELECT id FROM "Class" WHERE name='9A')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='braun.marcel@schule.de'),   'Marcel', 'Braun',    (SELECT id FROM "Class" WHERE name='9A')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='lange.sophie@schule.de'),   'Sophie', 'Lange',    (SELECT id FROM "Class" WHERE name='9A')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='weber.kilian@schule.de'),   'Kilian', 'Weber',    (SELECT id FROM "Class" WHERE name='9A'));

-- 10A (4 Schüler)
INSERT INTO "User" ("createdAt","updatedAt","email","password","displayName","role") VALUES
  (NOW(), NOW(), 'hoffmann.moritz@schule.de', '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Moritz Hoffmann',  'STUDENT'),
  (NOW(), NOW(), 'wolf.amelie@schule.de',     '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Amelie Wolf',      'STUDENT'),
  (NOW(), NOW(), 'becker.jakob@schule.de',    '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Jakob Becker',     'STUDENT'),
  (NOW(), NOW(), 'schmidt.lina@schule.de',    '$2b$10$rYjhot3R7O5MEtT8eKuBquU25SKh5r874F8S1MpDi9MBJwDtiHGki', 'Lina Schmidt',     'STUDENT');

INSERT INTO "Student" ("createdAt","updatedAt","userId","firstName","lastName","classId") VALUES
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='hoffmann.moritz@schule.de'), 'Moritz', 'Hoffmann', (SELECT id FROM "Class" WHERE name='10A')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='wolf.amelie@schule.de'),     'Amelie', 'Wolf',     (SELECT id FROM "Class" WHERE name='10A')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='becker.jakob@schule.de'),    'Jakob',  'Becker',   (SELECT id FROM "Class" WHERE name='10A')),
  (NOW(), NOW(), (SELECT id FROM "User" WHERE email='schmidt.lina@schule.de'),    'Lina',   'Schmidt',  (SELECT id FROM "Class" WHERE name='10A'));

-- ═══════════════════════════════════════════════════
-- ZUSAMMENFASSUNG
-- ═══════════════════════════════════════════════════
-- SELECT 'Users: '  || COUNT(*) FROM "User";
-- SELECT 'Teachers: ' || COUNT(*) FROM "Teacher";
-- SELECT 'Students: ' || COUNT(*) FROM "Student";
-- SELECT 'Classes: '  || COUNT(*) FROM "Class";
-- SELECT 'Rooms: '    || COUNT(*) FROM "Room";
-- SELECT 'Subjects: ' || COUNT(*) FROM "Subject";
