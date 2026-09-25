import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected) {
    return NextResponse.json(
      { error: "Revalidation service unavailable" },
      { status: 500 },
    );
  }

  if (!secret || !safeCompare(secret, expected)) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    revalidatePath("/", "layout");

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      paths: ["/", "/propiedades", "/propiedades/*", "/calamuchita", "/vender", "/contacto", "/sucursales"],
    });
  } catch {
    return NextResponse.json(
      { error: "Revalidation failed" },
      { status: 500 },
    );
  }
}
