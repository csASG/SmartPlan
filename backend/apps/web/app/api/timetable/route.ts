import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole, AuthError, authErrorToResponse } from "@/lib/auth";

export async function GET(): Promise<NextResponse> {
  try {
    await requireAuth();
    const entries = await prisma.timetableEntry.findMany({
      include: {
        class: true,
        subject: true,
        teacher: true,
        room: true,
      },
    });
    return NextResponse.json(entries);
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    console.error("GET /api/timetable error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await requireRole("ADMIN");
    const body = (await request.json()) as Record<string, unknown>;

    if (!body.subjectId) {
      return NextResponse.json({ error: "subjectId is required" }, { status: 400 });
    }

    if (!body.start || !body.end) {
      return NextResponse.json({ error: "start and end are required" }, { status: 400 });
    }

    const entry = await prisma.timetableEntry.create({
      data: {
        classId: (body.classId as number) ?? null,
        subjectId: body.subjectId as number,
        teacherId: (body.teacherId as number) ?? null,
        roomId: (body.roomId as number) ?? null,
        start: new Date(body.start as string),
        end: new Date(body.end as string),
        note: (body.note as string) ?? null,
      },
      include: {
        class: true,
        subject: true,
        teacher: true,
        room: true,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    console.error("POST /api/timetable error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
