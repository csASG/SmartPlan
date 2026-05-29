import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, AuthError, authErrorToResponse } from "@/lib/auth";
import { callSolver } from "@/lib/solver-client";

export async function POST(): Promise<NextResponse> {
  try {
    await requireRole("ADMIN");

    const [teachers, classes, rooms, timetableEntries] = await Promise.all([
      prisma.teacher.findMany(),
      prisma.class.findMany(),
      prisma.room.findMany(),
      prisma.timetableEntry.findMany({
        select: {
          teacherId: true,
          classId: true,
          subjectId: true,
        },
      }),
    ]);

    if (teachers.length === 0 || classes.length === 0 || rooms.length === 0) {
      return NextResponse.json(
        {
          error: "Bitte lege zuerst Lehrkräfte, Klassen und Räume in der Datenbank an.",
        },
        { status: 400 }
      );
    }

    if (timetableEntries.length === 0) {
      return NextResponse.json(
        {
          error:
            "Keine Stundenplan-Einträge gefunden. Lege zuerst Einträge an oder nutze den generischen Scheduler-Endpoint mit eigener Payload.",
        },
        { status: 400 }
      );
    }

    const requirementMap = new Map<
      string,
      {
        teacherId: number;
        classId: number;
        subjectId: number;
        hoursPerWeek: number;
      }
    >();

    for (const entry of timetableEntries) {
      if (!entry.teacherId || !entry.classId || !entry.subjectId) continue;

      const key = `${entry.teacherId}:${entry.classId}:${entry.subjectId}`;
      const existing = requirementMap.get(key);
      if (existing) {
        existing.hoursPerWeek += 1;
      } else {
        requirementMap.set(key, {
          teacherId: entry.teacherId,
          classId: entry.classId,
          subjectId: entry.subjectId,
          hoursPerWeek: 1,
        });
      }
    }

    if (requirementMap.size === 0) {
      return NextResponse.json(
        {
          error:
            "Die Stundenplan-Einträge enthalten keine vollständigen Lehrer-/Klassen-/Fach-Zuordnungen.",
        },
        { status: 400 }
      );
    }

    const payload = {
      teachers: teachers.map((t) => ({ id: t.id })),
      classes: classes.map((c) => ({ id: c.id })),
      rooms: rooms.map((r) => ({ id: r.id })),
      slots: Array.from({ length: 40 }, (_, i) => ({ id: i + 1 })),
      requirements: Array.from(requirementMap.values()),
    };

    const data = await callSolver(payload);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    const message = error instanceof Error ? error.message : "Unknown scheduler error";
    console.error("POST /api/timetable/generate-from-db error:", error);
    return NextResponse.json({ error: `Scheduler request error: ${message}` }, { status: 500 });
  }
}
