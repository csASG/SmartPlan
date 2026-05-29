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
    const cls = await prisma.class.findUnique({
      where: { id: Number(id) },
      include: { students: true },
    });

    if (!cls) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json(cls);
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    console.error("GET /api/classes/[id] error:", error);
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
    if (body.year !== undefined) data.year = body.year;

    const cls = await prisma.class.update({
      where: { id: Number(id) },
      data,
      include: { students: true },
    });

    return NextResponse.json(cls);
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    console.error("PATCH /api/classes/[id] error:", error);
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
    await prisma.class.delete({ where: { id: Number(id) } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    console.error("DELETE /api/classes/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
