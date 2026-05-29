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
    const teacher = await prisma.teacher.findUnique({
      where: { id: Number(id) },
      include: { user: { select: { id: true, email: true, displayName: true, role: true } } },
    });

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json(teacher);
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    console.error("GET /api/teachers/[id] error:", error);
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
    if (body.name !== undefined) data.name = body.name;
    if (body.userId !== undefined) data.userId = body.userId;

    const teacher = await prisma.teacher.update({
      where: { id: Number(id) },
      data,
      include: { user: true },
    });

    return NextResponse.json(teacher);
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    console.error("PATCH /api/teachers/[id] error:", error);
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
    await prisma.teacher.delete({ where: { id: Number(id) } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    console.error("DELETE /api/teachers/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
