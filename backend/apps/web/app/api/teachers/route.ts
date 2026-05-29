import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole, AuthError, authErrorToResponse } from "@/lib/auth";

export async function GET(): Promise<NextResponse> {
  try {
    await requireAuth();
    const teachers = await prisma.teacher.findMany({
      include: { user: { select: { id: true, email: true, displayName: true, role: true } } },
    });
    return NextResponse.json(teachers);
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    console.error("GET /api/teachers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await requireRole("ADMIN");
    const body = (await request.json()) as { name: string; userId?: number };

    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const teacher = await prisma.teacher.create({
      data: {
        name: body.name,
        userId: body.userId ?? null,
      },
      include: { user: true },
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    console.error("POST /api/teachers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
