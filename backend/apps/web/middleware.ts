import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import logger from "@/lib/logger";

export const config = {
  matcher: ["/api/:path*"],
};

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // 1. Rate limiting (using the original request)
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = (forwarded?.split(",")[0]?.trim() ?? "127.0.0.1").slice(0, 45);
  const path = request.nextUrl.pathname;

  const isLogin = path === "/api/auth/login";
  const isSolver = path.includes("/timetable/generate");
  const isWrite = request.method !== "GET" && request.method !== "HEAD";

  const limiterKey = isLogin ? `login:${ip}` : `${ip}:${isWrite ? "w" : "r"}`;
  const limits = isLogin
    ? RATE_LIMITS.login
    : isSolver
      ? RATE_LIMITS.solver
      : isWrite
        ? RATE_LIMITS.apiWrite
        : RATE_LIMITS.apiRead;

  const result = rateLimit(limiterKey, limits);

  if (!result.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": String(limits.maxRequests),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
        },
      }
    );
  }

  // 2. Request ID handling and logging
  const requestId = request.headers.get("x-request-id");

  if (!requestId) {
    // No request ID: assign one and rewrite
    const newRequestId = generateRequestId();
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-request-id", newRequestId);

    logger.info({
      requestId: newRequestId,
      event: "REQUEST_ID_ASSIGNED",
      method: request.method,
      url: request.nextUrl.pathname + request.nextUrl.search,
      ip,
    });

    return NextResponse.rewrite(request.url, {
      headers: requestHeaders,
    });
  }

  // Has request ID: log request, call next, log response
  logger.info({
    requestId,
    method: request.method,
    url: request.nextUrl.pathname + request.nextUrl.search,
    ip,
    userAgent: request.headers.get("user-agent"),
  });

  const start = Date.now();
  const response = await NextResponse.next();
  const durationMs = Date.now() - start;

  // Log response
  logger.info({
    requestId,
    status: response.status,
    durationMs,
    // Rate limit headers from result
    rateLimit: {
      limit: limits.maxRequests,
      remaining: result.remaining,
      reset: Math.ceil(result.resetAt / 1000),
    },
  });

  // Propagate request ID to client for tracing
  response.headers.set("x-request-id", requestId);

  return response;
}
