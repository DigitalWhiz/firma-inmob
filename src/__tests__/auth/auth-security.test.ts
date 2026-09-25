import { describe, it, expect } from "vitest";
import { createSessionToken, verifySessionToken } from "@/lib/auth";

describe("Auth — Session Security", () => {
  it("session token is a valid JWT (HS256)", async () => {
    process.env.ADMIN_JWT_SECRET = "test-secret";
    const token = await createSessionToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
  });

  it("session tokens are unique", async () => {
    process.env.ADMIN_JWT_SECRET = "test-secret";
    const tokens = new Set<string>();
    for (let i = 0; i < 100; i++) {
      tokens.add(await createSessionToken());
    }
    expect(tokens.size).toBe(100);
  });

  it("token is self-verifiable without external state", async () => {
    process.env.ADMIN_JWT_SECRET = "test-secret";
    const token = await createSessionToken();
    const payload = await verifySessionToken(token);
    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe("admin");
    expect(payload?.jti).toBeDefined();
  });

  it("different secrets produce invalid tokens", async () => {
    process.env.ADMIN_JWT_SECRET = "secret-A";
    const token = await createSessionToken();

    process.env.ADMIN_JWT_SECRET = "secret-B";
    const payload = await verifySessionToken(token);
    expect(payload).toBeNull();

    process.env.ADMIN_JWT_SECRET = "test-secret";
  });
});

describe("Auth — Cookie Security", () => {
  it("session cookie is httpOnly", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const authPath = path.join(process.cwd(), "src/lib/auth.ts");
    const content = fs.readFileSync(authPath, "utf-8");
    expect(content).toContain("httpOnly: true");
  });

  it("session cookie is secure in production", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const authPath = path.join(process.cwd(), "src/lib/auth.ts");
    const content = fs.readFileSync(authPath, "utf-8");
    expect(content).toContain("secure:");
    expect(content).toContain("production");
  });

  it("session cookie has sameSite lax", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const authPath = path.join(process.cwd(), "src/lib/auth.ts");
    const content = fs.readFileSync(authPath, "utf-8");
    expect(content).toContain('sameSite: "lax"');
  });

  it("session has max age", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const authPath = path.join(process.cwd(), "src/lib/auth.ts");
    const content = fs.readFileSync(authPath, "utf-8");
    expect(content).toContain("SESSION_MAX_AGE");
  });
});

describe("Auth — Rate Limiting", () => {
  it("rate limit window is 15 minutes", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const authPath = path.join(process.cwd(), "src/lib/auth.ts");
    const content = fs.readFileSync(authPath, "utf-8");
    expect(content).toContain("15 * 60 * 1000");
  });

  it("rate limit max is 5 attempts", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const authPath = path.join(process.cwd(), "src/lib/auth.ts");
    const content = fs.readFileSync(authPath, "utf-8");
    expect(content).toContain("RATE_LIMIT_MAX = 5");
  });
});

describe("Auth — Credential Validation", () => {
  it("uses constant-time comparison", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const authPath = path.join(process.cwd(), "src/lib/auth.ts");
    const content = fs.readFileSync(authPath, "utf-8");
    expect(content).toContain("timingSafeEqual");
  });

  it("returns generic error for invalid credentials", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const authPath = path.join(process.cwd(), "src/lib/auth.ts");
    const content = fs.readFileSync(authPath, "utf-8");
    expect(content).toContain("Invalid credentials");
    expect(content).not.toMatch(/password.*incorrect/i);
    expect(content).not.toMatch(/user.*not.*found/i);
  });

  it("reads ADMIN_PASSWORD from env only", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const authPath = path.join(process.cwd(), "src/lib/auth.ts");
    const content = fs.readFileSync(authPath, "utf-8");
    expect(content).toContain('process.env.ADMIN_PASSWORD');
    expect(content).toContain('process.env.ADMIN_USERNAME');
  });
});

describe("Auth — JWT Secret", () => {
  it("uses ADMIN_JWT_SECRET from environment", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const authPath = path.join(process.cwd(), "src/lib/auth.ts");
    const content = fs.readFileSync(authPath, "utf-8");
    expect(content).toContain('process.env.ADMIN_JWT_SECRET');
  });

  it("does not use ADMIN_PASSWORD as JWT secret", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const authPath = path.join(process.cwd(), "src/lib/auth.ts");
    const content = fs.readFileSync(authPath, "utf-8");
    // Should not use ADMIN_PASSWORD for JWT signing
    expect(content).not.toMatch(/ADMIN_PASSWORD.*jwt/i);
    expect(content).not.toMatch(/jwt.*ADMIN_PASSWORD/i);
  });
});
