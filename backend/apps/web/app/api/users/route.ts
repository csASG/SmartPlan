import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole, AuthError, authErrorToResponse } from "@/lib/auth";

export async function GET(): Promise<NextResponse> {
  try {
    await requireAuth();
    const users = await prisma.user.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        displayName: true,
        role: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await requireRole("ADMIN");
    const body = (await request.json()) as Record<string, unknown>;

    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const hashedPassword =
      typeof body.password === "string" ? await bcrypt.hash(body.password, 10) : undefined;

    const user = await prisma.user.create({
      data: {
        email: body.email as string,
        password: hashedPassword,
        displayName: (body.displayName as string) ?? null,
        role: (body.role as "ADMIN" | "TEACHER" | "STUDENT") ?? "STUDENT",
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        displayName: true,
        role: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) return authErrorToResponse(error);
    console.error("POST /api/users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
