import { NextResponse } from "next/server";
import { requireRole, AuthError, authErrorToResponse } from "@/lib/auth";
import { callSolver } from "@/lib/solver-client";

interface SchedulerPayload {
  teachers: { id: number }[];
  classes: { id: number }[];
  rooms: { id: number }[];
  slots: { id: number }[];
  requirements: {
    teacherId: number;
    classId: number;
    subjectId: number;
    hoursPerWeek: number;
  }[];
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await requireRole("ADMIN");
    const payload = (await request.json()) as SchedulerPayload;
    const data = await callSolver(payload);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    const message = error instanceof Error ? error.message : "Unknown scheduler error";
    console.error("POST /api/timetable/generate error:", error);
    return NextResponse.json({ error: `Scheduler request error: ${message}` }, { status: 500 });
  }
}
