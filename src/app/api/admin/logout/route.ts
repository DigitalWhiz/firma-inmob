import { NextResponse } from "next/server";
import { removeSessionCookie } from "@/lib/auth";

export async function POST() {
  // JWT tokens are stateless — cookie deletion is sufficient.
  // The token auto-expires via `exp` claim. No server-side revocation needed
  // for admin-only use with short-lived sessions (8h).
  await removeSessionCookie();

  return NextResponse.json({ success: true });
}
