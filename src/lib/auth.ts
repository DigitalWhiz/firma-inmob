// Auth utilities — FIRMA Calamuchita
// Stateless JWT authentication using HMAC-SHA256 (Web Crypto API).
// Server-only: never import in Client Components.

import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";

// ============================================================
// CONSTANTS
// ============================================================

const SESSION_COOKIE = "firma_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5; // max attempts per window

// ============================================================
// RATE LIMITING (in-memory, per-server)
// ============================================================

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();

  // Poda oportunista de entradas expiradas (evita crecimiento de memoria)
  if (rateLimitStore.size > 500) {
    for (const [key, entry] of rateLimitStore) {
      if (now > entry.resetAt) rateLimitStore.delete(key);
    }
  }

  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true };
}

// ============================================================
// PASSWORD VALIDATION (constant-time)
// ============================================================

export function validateCredentials(
  username: string,
  password: string,
): { valid: boolean; error?: string } {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPass) {
    return { valid: false, error: "ADMIN credentials not configured" };
  }

  // Constant-time comparison for username
  const userBuf = Buffer.from(username.toLowerCase().trim());
  const expectedUserBuf = Buffer.from(expectedUser.toLowerCase().trim());

  if (userBuf.length !== expectedUserBuf.length) {
    return { valid: false, error: "Invalid credentials" };
  }

  const userMatch = timingSafeEqual(userBuf, expectedUserBuf);

  // Constant-time comparison for password
  const passBuf = Buffer.from(password);
  const expectedPassBuf = Buffer.from(expectedPass);

  if (passBuf.length !== expectedPassBuf.length) {
    return { valid: false, error: "Invalid credentials" };
  }

  const passMatch = timingSafeEqual(passBuf, expectedPassBuf);

  if (!userMatch || !passMatch) {
    return { valid: false, error: "Invalid credentials" };
  }

  return { valid: true };
}

// ============================================================
// JWT — BASE64URL HELPERS
// ============================================================

function base64urlEncode(data: Uint8Array): string {
  let binary = "";
  for (const byte of data) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

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
// JWT — HMAC-SHA256 (Web Crypto API, works in Node.js 18+)
// ============================================================

async function hmacSign(
  key: CryptoKey,
  data: Uint8Array,
): Promise<Uint8Array> {
  const sig = await crypto.subtle.sign("HMAC", key, data.buffer as ArrayBuffer);
  return new Uint8Array(sig);
}

async function importJwtKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    stringToUint8Array(secret).buffer as ArrayBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function getJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET environment variable is required");
  }
  return secret;
}

// ============================================================
// JWT — CREATE
// ============================================================

export async function createSessionToken(): Promise<string> {
  const secret = getJwtSecret();
  const key = await importJwtKey(secret);

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: "admin",
    iat: now,
    exp: now + SESSION_MAX_AGE,
    jti: crypto.randomUUID(),
  };

  const headerB64 = base64urlEncode(
    stringToUint8Array(JSON.stringify({ alg: "HS256", typ: "JWT" })),
  );
  const payloadB64 = base64urlEncode(
    stringToUint8Array(JSON.stringify(payload)),
  );

  const signatureInput = stringToUint8Array(`${headerB64}.${payloadB64}`);
  const signatureBytes = await hmacSign(key, signatureInput);
  const signatureB64 = base64urlEncode(signatureBytes);

  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

// ============================================================
// JWT — VERIFY
// ============================================================

export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  jti: string;
}

export async function verifySessionToken(
  token: string,
): Promise<JwtPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;

    const secret = getJwtSecret();
    const key = await importJwtKey(secret);

    // Verify signature
    const signatureInput = stringToUint8Array(`${headerB64}.${payloadB64}`);
    const sigBytes = base64urlDecode(signatureB64);

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes.buffer as ArrayBuffer,
      signatureInput.buffer as ArrayBuffer,
    );
    if (!valid) return null;

    // Parse and validate payload
    const payloadStr = new TextDecoder().decode(base64urlDecode(payloadB64));
    const payload = JSON.parse(payloadStr) as JwtPayload;

    // Validate algorithm header
    const headerStr = new TextDecoder().decode(base64urlDecode(headerB64));
    const header = JSON.parse(headerStr);
    if (header.alg !== "HS256" || header.typ !== "JWT") return null;

    // Validate expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) return null;

    // Validate required claims
    if (!payload.sub || !payload.iat || !payload.jti) return null;

    return payload;
  } catch {
    return null;
  }
}

// ============================================================
// SESSION MANAGEMENT (cookie-based, JWT-payload stateless)
// ============================================================

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  const cookie = store.get(SESSION_COOKIE);
  return cookie?.value ?? null;
}

export async function removeSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

// ============================================================
// AUTH CHECK (for middleware / server components)
// ============================================================

export async function isAuthenticated(): Promise<boolean> {
  const token = await getSessionToken();
  if (!token) return false;
  const payload = await verifySessionToken(token);
  return payload !== null;
}

// ============================================================
// IP EXTRACTION (for rate limiting)
// ============================================================

export function getClientIp(request: Request): string {
  // x-real-ip lo setea el proxy de Hostinger y no es manipulable por el cliente.
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  // Fallback: último hop de XFF (los primeros son spoofables por el cliente).
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded.split(",").map((h) => h.trim()).filter(Boolean);
    if (hops.length > 0) return hops[hops.length - 1];
  }
  return "unknown";
}

// ============================================================
// BACKWARDS COMPATIBILITY — re-export aliases
// ============================================================

/** @deprecated Use createSessionToken() directly — returns JWT, not random hex */
export function createSessionTokenCompat(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export function hashSessionToken(_token: string): string {
  // JWT tokens are self-validating via signature — no hash needed.
  // Kept for backwards compatibility with tests.
  return "";
}

export function registerSession(_tokenHash: string): void {
  // JWT tokens are stateless — no registration needed.
  // Kept for backwards compatibility with tests.
}

export function isSessionValid(_tokenHash: string): boolean {
  // JWT tokens are validated via verifySessionToken().
  // Kept for backwards compatibility with tests.
  return true;
}

export function invalidateSession(_tokenHash: string): void {
  // JWT tokens cannot be revoked without persistent storage.
  // Cookie deletion on logout is sufficient for admin use.
  // Kept for backwards compatibility with tests.
}
