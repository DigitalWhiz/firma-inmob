// Middleware — FIRMA Calamuchita
// Protects /admin routes and /api/admin/* routes.
// Validates JWT tokens statelessly (no in-memory session map).

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE = "firma_session";

// ============================================================
// BASE64URL HELPERS (Edge-compatible, no Node.js crypto)
// ============================================================

function base64urlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// ============================================================
// JWT VERIFICATION (Edge-compatible HMAC-SHA256 via SubtleCrypto)
// ============================================================

async function verifyJwt(
  token: string,
  secret: string,
): Promise<{ valid: boolean; expired?: boolean }> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false };

    const [headerB64, payloadB64, signatureB64] = parts;

    // Import HMAC key
    const key = await crypto.subtle.importKey(
      "raw",
      stringToUint8Array(secret).buffer as ArrayBuffer,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    // Verify signature
    const signatureInput = stringToUint8Array(`${headerB64}.${payloadB64}`);
    const sigBytes = base64urlDecode(signatureB64);

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes.buffer as ArrayBuffer,
      signatureInput.buffer as ArrayBuffer,
    );
    if (!valid) return { valid: false };

    // Parse payload
    const payloadStr = new TextDecoder().decode(base64urlDecode(payloadB64));
    const payload = JSON.parse(payloadStr);

    // Validate algorithm header
    const headerStr = new TextDecoder().decode(base64urlDecode(headerB64));
    const header = JSON.parse(headerStr);
    if (header.alg !== "HS256" || header.typ !== "JWT") return { valid: false };

    // Validate expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) return { valid: false, expired: true };

    // Validate required claims
    if (!payload.sub || !payload.iat || !payload.jti) return { valid: false };

    return { valid: true };
  } catch {
    return { valid: false };
  }
}

// ============================================================
// MIDDLEWARE
// ============================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and login API
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // Protect /admin/* and /api/admin/*
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

    if (!sessionToken) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 },
        );
      }
      // Redirect to login for page requests
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validate JWT (stateless, survives server restarts)
    const jwtSecret = process.env.ADMIN_JWT_SECRET;
    if (!jwtSecret) {
      // Fallback: if JWT secret is not configured, deny access
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { error: "Server configuration error" },
          { status: 500 },
        );
      }
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    const { valid, expired } = await verifyJwt(sessionToken, jwtSecret);

    if (!valid) {
      // Clear invalid cookie
      const response = pathname.startsWith("/api/admin")
        ? NextResponse.json(
            { error: expired ? "Session expired" : "Invalid session" },
            { status: 401 },
          )
        : NextResponse.redirect(new URL("/admin/login", request.url));

      response.cookies.delete(ADMIN_SESSION_COOKIE);
      return response;
    }

    // JWT is valid — allow through
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
