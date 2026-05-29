import 'dotenv/config';
import { Client } from 'pg';
import * as bcrypt from 'bcrypt';

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);
    const now = new Date();

    // Check if admin exists
    const existing = await client.query(`SELECT "id" FROM "User" WHERE "email" = $1`, ['admin@example.com']);
    if (existing.rows.length > 0) {
      console.log('Seed already exists. Skipping.');
      return;
    }

    // Admin User
    await client.query(
      `INSERT INTO "User" ("createdAt","updatedAt","email","password","displayName","role") VALUES ($1,$2,$3,$4,$5,$6)`,
      [now, now, 'admin@example.com', hashedPassword, 'Administrator', 'ADMIN']
    );

    // Teacher User + Teacher record
    const teacherUser = await client.query(
      `INSERT INTO "User" ("createdAt","updatedAt","email","password","displayName","role") VALUES ($1,$2,$3,$4,$5,$6) RETURNING "id"`,
      [now, now, 'teacher@example.com', teacherPassword, 'Dr. Schmidt', 'TEACHER']
    );
    await client.query(
      `INSERT INTO "Teacher" ("createdAt","updatedAt","userId","name") VALUES ($1,$2,$3,$4)`,
      [now, now, teacherUser.rows[0].id, 'Dr. Schmidt']
    );

    // Student User + Class + Student record
    const classRow = await client.query(
      `INSERT INTO "Class" ("name","year") VALUES ($1,$2) RETURNING "id"`,
      ['10A', 10]
    );
    const studentUser = await client.query(
      `INSERT INTO "User" ("createdAt","updatedAt","email","password","displayName","role") VALUES ($1,$2,$3,$4,$5,$6) RETURNING "id"`,
      [now, now, 'student@example.com', studentPassword, 'Max Mustermann', 'STUDENT']
    );
    await client.query(
      `INSERT INTO "Student" ("createdAt","updatedAt","userId","firstName","lastName","classId") VALUES ($1,$2,$3,$4,$5,$6)`,
      [now, now, studentUser.rows[0].id, 'Max', 'Mustermann', classRow.rows[0].id]
    );

    // Rooms
    for (const [name, cap] of [['R101', 30], ['R102', 28], ['R103', 32], ['Lab1', 24], ['Lab2', 24], ['PC1', 20]]) {
      await client.query(`INSERT INTO "Room" ("name","capacity") VALUES ($1,$2)`, [name, cap]);
    }

    // Subjects
    for (const [name, code] of [['Mathematik', 'MATH'], ['Deutsch', 'DE'], ['Englisch', 'EN'], ['Physik', 'PHYS'], ['Informatik', 'INF'], ['Chemie', 'CHEM'], ['Geschichte', 'GES'], ['Sport', 'SPORT'], ['Kunst', 'KUNST']]) {
      await client.query(`INSERT INTO "Subject" ("name","code") VALUES ($1,$2)`, [name, code]);
    }

    console.log('Seed completed successfully!');
    console.log('Login credentials:');
    console.log('  Admin:   admin@example.com / admin123');
    console.log('  Teacher: teacher@example.com / teacher123');
    console.log('  Student: student@example.com / student123');
  } finally {
    await client.end();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
