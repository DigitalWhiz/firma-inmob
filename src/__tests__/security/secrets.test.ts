import { describe, it, expect } from "vitest";

describe("Security — Secrets Never Exposed", () => {
  it("TOKKO_API_KEY is not in any Client Component", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const clientFiles = [
      "src/components/property/PropertyHero.tsx",
      "src/components/property/PropertyMediaGallery.tsx",
      "src/components/property/PropertyVideoIndicator.tsx",
      "src/components/property/PropertyShare.tsx",
      "src/components/property/FavoriteButton.tsx",
      "src/components/property/WhatsAppStickyCTA.tsx",
      "src/components/property/PropertyStatusBadge.tsx",
      "src/components/layout/Header.tsx",
      "src/components/sections/Hero.tsx",
      "src/components/ui/ScrollReveal.tsx",
      "src/app/admin/AdminSyncButton.tsx",
      "src/app/admin/AdminLogoutButton.tsx",
      "src/app/admin/AdminPropertyList.tsx",
      "src/app/admin/login/page.tsx",
    ];

    for (const file of clientFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        expect(content).not.toContain("TOKKO_API_KEY");
        expect(content).not.toContain("REVALIDATE_SECRET");
        expect(content).not.toContain("ADMIN_PASSWORD");
        expect(content).not.toContain("ADMIN_JWT_SECRET");
        expect(content).not.toContain("process.env");
      }
    }
  });

  it("REVALIDATE_SECRET is never exposed in client responses", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const routeFiles = [
      "src/app/api/revalidate/route.ts",
    ];

    for (const file of routeFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        expect(content).not.toContain("secret: process.env.REVALIDATE_SECRET");
        expect(content).not.toContain("REVALIDATE_SECRET,");
      }
    }
  });

  it("ADMIN_PASSWORD is never hardcoded in source files", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const srcDir = path.join(process.cwd(), "src");
    const files = getAllFiles(srcDir, ".ts", ".tsx");

    for (const file of files) {
      if (file.includes("__tests__")) continue;

      const content = fs.readFileSync(file, "utf-8");
      expect(content).not.toContain("NEXT_PUBLIC_ADMIN_PASSWORD");
      expect(content).not.toMatch(/ADMIN_PASSWORD\s*=\s*["'][^"']+["']/);
    }
  });

  it("ADMIN_JWT_SECRET is never hardcoded in source files", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const srcDir = path.join(process.cwd(), "src");
    const files = getAllFiles(srcDir, ".ts", ".tsx");

    for (const file of files) {
      if (file.includes("__tests__")) continue;

      const content = fs.readFileSync(file, "utf-8");
      expect(content).not.toContain("NEXT_PUBLIC_ADMIN_JWT_SECRET");
      expect(content).not.toMatch(/ADMIN_JWT_SECRET\s*=\s*["'][^"']+["']/);
    }
  });

  it("no console.log/warn/error exposes secrets", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const srcDir = path.join(process.cwd(), "src");
    const files = getAllFiles(srcDir, ".ts", ".tsx");

    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8");
      const lines = content.split("\n");

      for (const line of lines) {
        if (line.includes("console.") && (line.includes("log") || line.includes("warn") || line.includes("error"))) {
          expect(line).not.toContain("TOKKO_API_KEY");
          expect(line).not.toContain("REVALIDATE_SECRET");
          expect(line).not.toContain("ADMIN_PASSWORD");
          expect(line).not.toContain("ADMIN_JWT_SECRET");
          expect(line).not.toContain("password");
        }
      }
    }
  });

  it("no NEXT_PUBLIC_ variables for secrets", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const envFiles = [".env", ".env.local", ".env.example"];

    for (const file of envFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        expect(content).not.toContain("NEXT_PUBLIC_TOKKO_API_KEY");
        expect(content).not.toContain("NEXT_PUBLIC_REVALIDATE_SECRET");
        expect(content).not.toContain("NEXT_PUBLIC_ADMIN_PASSWORD");
        expect(content).not.toContain("NEXT_PUBLIC_ADMIN_JWT_SECRET");
      }
    }
  });
});

function getAllFiles(dir: string, ...extensions: string[]): string[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fsSync = require("fs") as typeof import("fs");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pathMod = require("path") as typeof import("path");
  const files: string[] = [];

  const entries = fsSync.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = pathMod.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, ...extensions));
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }

  return files;
}
