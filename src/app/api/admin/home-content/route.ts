import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getHomeContent, updateHomeContent } from "@/lib/editorial/store";
import type { HomeContentInput } from "@/types/editorial";
import { DEFAULT_HOME_CONTENT } from "@/types/editorial";

async function checkAuth(): Promise<boolean> {
  return isAuthenticated();
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getHomeContent();
  return NextResponse.json({ homeContent: content });
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: HomeContentInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Validate heroPropertyId
  if (
    body.heroPropertyId !== undefined &&
    body.heroPropertyId !== null &&
    (typeof body.heroPropertyId !== "number" ||
      !Number.isFinite(body.heroPropertyId) ||
      body.heroPropertyId <= 0)
  ) {
    return NextResponse.json(
      { error: "Invalid heroPropertyId" },
      { status: 400 },
    );
  }

  // Validate featuredPropertyIds
  if (body.featuredPropertyIds !== undefined) {
    if (!Array.isArray(body.featuredPropertyIds)) {
      return NextResponse.json(
        { error: "featuredPropertyIds must be an array" },
        { status: 400 },
      );
    }

    // Check all IDs are positive finite numbers
    for (const id of body.featuredPropertyIds) {
      if (typeof id !== "number" || !Number.isFinite(id) || id <= 0) {
        return NextResponse.json(
          { error: "Invalid ID in featuredPropertyIds" },
          { status: 400 },
        );
      }
    }

    // Check for duplicates
    const uniqueIds = new Set(body.featuredPropertyIds);
    if (uniqueIds.size !== body.featuredPropertyIds.length) {
      return NextResponse.json(
        { error: "Duplicate IDs in featuredPropertyIds" },
        { status: 400 },
      );
    }

    // Limit to 10 featured properties
    if (body.featuredPropertyIds.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 featured properties allowed" },
        { status: 400 },
      );
    }
  }

  // Validate: hero cannot be in featured list
  const heroId = body.heroPropertyId ?? DEFAULT_HOME_CONTENT.heroPropertyId;
  const featuredIds = body.featuredPropertyIds ?? DEFAULT_HOME_CONTENT.featuredPropertyIds;
  if (heroId !== null && featuredIds.includes(heroId)) {
    return NextResponse.json(
      { error: "Hero property cannot also be in featured list" },
      { status: 400 },
    );
  }

  const updated = await updateHomeContent(body);
  return NextResponse.json({ homeContent: updated });
}
