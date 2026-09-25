import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Revalidation Route", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("rejects requests without secret header", async () => {
    process.env.REVALIDATE_SECRET = "test-secret";
    const { POST } = await import("@/app/api/revalidate/route");

    const request = new Request("http://localhost/api/revalidate", {
      method: "POST",
      headers: {},
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("Invalid secret");
  });

  it("rejects requests with wrong secret", async () => {
    process.env.REVALIDATE_SECRET = "correct-secret";
    const { POST } = await import("@/app/api/revalidate/route");

    const request = new Request("http://localhost/api/revalidate", {
      method: "POST",
      headers: { "x-revalidate-secret": "wrong-secret" },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("Invalid secret");
  });

  it("accepts requests with correct secret", async () => {
    process.env.REVALIDATE_SECRET = "correct-secret";
    const { POST } = await import("@/app/api/revalidate/route");

    const request = new Request("http://localhost/api/revalidate", {
      method: "POST",
      headers: { "x-revalidate-secret": "correct-secret" },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.revalidated).toBe(true);
    expect(body.timestamp).toBeDefined();
    expect(body.paths).toContain("/");
    expect(body.paths).toContain("/propiedades");
  });

  it("returns 500 when REVALIDATE_SECRET not configured", async () => {
    delete process.env.REVALIDATE_SECRET;
    const { POST } = await import("@/app/api/revalidate/route");

    const request = new Request("http://localhost/api/revalidate", {
      method: "POST",
      headers: { "x-revalidate-secret": "any" },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Revalidation service unavailable");
  });
});
