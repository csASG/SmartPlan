import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole, AuthError, authErrorToResponse } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await requireAuth();
    const { id } = await params;
    const entry = await prisma.timetableEntry.findUnique({
      where: { id: Number(id) },
      include: {
        class: true,
        subject: true,
        teacher: true,
        room: true,
      },
    });

    if (!entry) {
      return NextResponse.json({ error: "Timetable entry not found" }, { status: 404 });
    }

    return NextResponse.json(entry);
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    console.error("GET /api/timetable/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await requireRole("ADMIN");
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;

    const data: Record<string, unknown> = {};
    if (body.classId !== undefined) data.classId = body.classId;
    if (body.subjectId !== undefined) data.subjectId = body.subjectId;
    if (body.teacherId !== undefined) data.teacherId = body.teacherId;
    if (body.roomId !== undefined) data.roomId = body.roomId;
    if (body.start !== undefined) data.start = new Date(body.start as string);
    if (body.end !== undefined) data.end = new Date(body.end as string);
    if (body.note !== undefined) data.note = body.note;

    const entry = await prisma.timetableEntry.update({
      where: { id: Number(id) },
      data,
      include: {
        class: true,
        subject: true,
        teacher: true,
        room: true,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    console.error("PATCH /api/timetable/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await requireRole("ADMIN");
    const { id } = await params;
    await prisma.timetableEntry.delete({ where: { id: Number(id) } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    console.error("DELETE /api/timetable/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
