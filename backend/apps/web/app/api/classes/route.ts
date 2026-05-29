import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole, AuthError, authErrorToResponse } from "@/lib/auth";

export async function GET(): Promise<NextResponse> {
  try {
    await requireAuth();
    const classes = await prisma.class.findMany({
      include: { students: true },
    });
    return NextResponse.json(classes);
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    console.error("GET /api/classes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await requireRole("ADMIN");
    const body = (await request.json()) as { name: string; year?: number };

    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const cls = await prisma.class.create({
      data: {
        name: body.name,
        year: body.year ?? null,
      },
    });

    return NextResponse.json(cls, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    console.error("POST /api/classes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
