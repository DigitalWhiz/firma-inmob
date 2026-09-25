import { describe, it, expect } from "vitest";
import {
  validateCredentials,
  createSessionToken,
  verifySessionToken,
} from "@/lib/auth";

describe("Auth Utilities", () => {
  describe("validateCredentials", () => {
    it("rejects when ADMIN_USERNAME not configured", () => {
      delete process.env.ADMIN_USERNAME;
      process.env.ADMIN_PASSWORD = "test-pass";

      const result = validateCredentials("test@example.com", "test-pass");
      expect(result.valid).toBe(false);
    });

    it("rejects when ADMIN_PASSWORD not configured", () => {
      process.env.ADMIN_USERNAME = "test@example.com";
      delete process.env.ADMIN_PASSWORD;

      const result = validateCredentials("test@example.com", "test-pass");
      expect(result.valid).toBe(false);
    });

    it("rejects invalid credentials", () => {
      process.env.ADMIN_USERNAME = "info@firmacalamuchita.com";
      process.env.ADMIN_PASSWORD = "correct-password";

      const result = validateCredentials("wrong@example.com", "wrong-password");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Invalid credentials");
    });

    it("accepts valid credentials", () => {
      process.env.ADMIN_USERNAME = "info@firmacalamuchita.com";
      process.env.ADMIN_PASSWORD = "correct-password";

      const result = validateCredentials("info@firmacalamuchita.com", "correct-password");
      expect(result.valid).toBe(true);
    });

    it("is case-insensitive for username", () => {
      process.env.ADMIN_USERNAME = "info@firmacalamuchita.com";
      process.env.ADMIN_PASSWORD = "correct-password";

      const result = validateCredentials("INFO@FIRMACALAMUCHITA.COM", "correct-password");
      expect(result.valid).toBe(true);
    });

    it("never exposes the password in error messages", () => {
      process.env.ADMIN_USERNAME = "info@firmacalamuchita.com";
      process.env.ADMIN_PASSWORD = "super-secret-password-123";

      const result = validateCredentials("wrong@example.com", "super-secret-password-123");
      expect(result.error).not.toContain("super-secret-password-123");
    });
  });

  describe("JWT Session Token", () => {
    it("generates a valid JWT token", async () => {
      process.env.ADMIN_JWT_SECRET = "test-secret-for-unit-tests";
      const token = await createSessionToken();
      expect(token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
    });

    it("generates unique tokens", async () => {
      process.env.ADMIN_JWT_SECRET = "test-secret-for-unit-tests";
      const token1 = await createSessionToken();
      const token2 = await createSessionToken();
      expect(token1).not.toBe(token2);
    });

    it("verifies a valid token", async () => {
      process.env.ADMIN_JWT_SECRET = "test-secret-for-unit-tests";
      const token = await createSessionToken();
      const payload = await verifySessionToken(token);
      expect(payload).not.toBeNull();
      expect(payload?.sub).toBe("admin");
    });

    it("rejects an invalid token", async () => {
      process.env.ADMIN_JWT_SECRET = "test-secret-for-unit-tests";
      const payload = await verifySessionToken("invalid.token.here");
      expect(payload).toBeNull();
    });

    it("rejects token with wrong secret", async () => {
      process.env.ADMIN_JWT_SECRET = "test-secret-for-unit-tests";
      const token = await createSessionToken();

      process.env.ADMIN_JWT_SECRET = "different-secret";
      const payload = await verifySessionToken(token);
      expect(payload).toBeNull();

      // Restore
      process.env.ADMIN_JWT_SECRET = "test-secret-for-unit-tests";
    });

    it("rejects expired token", async () => {
      process.env.ADMIN_JWT_SECRET = "test-secret-for-unit-tests";

      // Create a token with very short expiry by manipulating time
      const { createHmac } = await import("crypto");
      const now = Math.floor(Date.now() / 1000);
      const expiredPayload = {
        sub: "admin",
        iat: now - 10000,
        exp: now - 1, // expired 1 second ago
        jti: "test-expired-id",
      };

      const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
      const payload = Buffer.from(JSON.stringify(expiredPayload)).toString("base64url");
      const sig = createHmac("sha256", "test-secret-for-unit-tests")
        .update(`${header}.${payload}`)
        .digest("base64url");
      const token = `${header}.${payload}.${sig}`;

      const result = await verifySessionToken(token);
      expect(result).toBeNull();
    });

    it("rejects token with invalid algorithm", async () => {
      process.env.ADMIN_JWT_SECRET = "test-secret-for-unit-tests";

      const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
      const payload = Buffer.from(JSON.stringify({ sub: "admin", iat: Date.now(), exp: Date.now() + 3600000, jti: "x" })).toString("base64url");
      const token = `${header}.${payload}.`;

      const result = await verifySessionToken(token);
      expect(result).toBeNull();
    });
  });
});
