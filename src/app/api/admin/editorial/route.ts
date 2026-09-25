import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getAllOverrides,
  upsertOverride,
  deleteOverride,
} from "@/lib/editorial/store";
import type { EditorialOverrideInput } from "@/types/editorial";

async function checkAuth(): Promise<boolean> {
  return isAuthenticated();
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const overrides = await getAllOverrides();
  return NextResponse.json({ overrides });
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: EditorialOverrideInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!body.propertyId || typeof body.propertyId !== "number") {
    return NextResponse.json({ error: "Invalid propertyId" }, { status: 400 });
  }

  // Validate sortOrder bounds
  if (body.sortOrder !== undefined) {
    if (typeof body.sortOrder !== "number" || !Number.isFinite(body.sortOrder)) {
      return NextResponse.json({ error: "Invalid sortOrder" }, { status: 400 });
    }
    if (body.sortOrder < -10000 || body.sortOrder > 10000) {
      return NextResponse.json({ error: "sortOrder out of range" }, { status: 400 });
    }
  }

  // Validate editorialStatus
  if (
    body.editorialStatus !== undefined &&
    !["available", "reserved", "sold"].includes(body.editorialStatus)
  ) {
    return NextResponse.json({ error: "Invalid editorialStatus" }, { status: 400 });
  }

  // Validate boolean fields
  if (body.visible !== undefined && typeof body.visible !== "boolean") {
    return NextResponse.json({ error: "Invalid visible field" }, { status: 400 });
  }
  if (body.featured !== undefined && typeof body.featured !== "boolean") {
    return NextResponse.json({ error: "Invalid featured field" }, { status: 400 });
  }

  // Sanitize internalNote (strip any potential injection)
  if (body.internalNote !== undefined) {
    if (typeof body.internalNote !== "string") {
      return NextResponse.json({ error: "Invalid internalNote" }, { status: 400 });
    }
    body.internalNote = body.internalNote.slice(0, 500);
  }

  const override = await upsertOverride(body);
  return NextResponse.json({ override });
}

export async function DELETE(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const propertyId = parseInt(searchParams.get("propertyId") || "", 10);

  if (isNaN(propertyId) || propertyId <= 0) {
    return NextResponse.json({ error: "Invalid propertyId" }, { status: 400 });
  }

  const deleted = await deleteOverride(propertyId);
  return NextResponse.json({ deleted });
}
