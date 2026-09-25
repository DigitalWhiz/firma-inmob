import { NextResponse } from "next/server";
import {
  validateCredentials,
  createSessionToken,
  setSessionCookie,
  checkRateLimit,
  getClientIp,
} from "@/lib/auth";

export async function POST(request: Request) {
  // Rate limiting by IP
  const ip = getClientIp(request);

  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  // Parse body
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 },
    );
  }

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 },
    );
  }

  // Validate credentials (constant-time)
  const result = validateCredentials(email, password);

  if (!result.valid) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 },
    );
  }

  // Create JWT session token (stateless, survives server restarts)
  const token = await createSessionToken();
  await setSessionCookie(token);

  return NextResponse.json({ success: true });
}
