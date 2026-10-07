import { describe, it, expect } from "vitest";

describe("Security — Secrets Comprehensive Scan", () => {
  it("TOKKO_API_KEY never in client components", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const clientFiles = [
      "src/components/property/PropertyHero.tsx",
      "src/components/property/PropertyMediaGallery.tsx",
      "src/components/property/PropertyVideoIndicator.tsx",
      "src/components/property/PropertyShare.tsx",
      "src/components/property/FavoriteButton.tsx",
      "src/components/property/WhatsAppStickyCTA.tsx",
      "src/components/layout/Header.tsx",
      "src/components/sections/Hero.tsx",
      "src/components/ui/ScrollReveal.tsx",
    ];

    for (const file of clientFiles) {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).not.toContain("TOKKO_API_KEY");
      expect(content).not.toContain("REVALIDATE_SECRET");
      expect(content).not.toContain("ADMIN_PASSWORD");
    }
  });

  it("REVALIDATE_SECRET never returned in API responses", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const routeFiles = [
      "src/app/api/revalidate/route.ts",
      "src/app/api/admin/login/route.ts",
      "src/app/api/admin/logout/route.ts",
      "src/app/api/admin/editorial/route.ts",
    ];

    for (const file of routeFiles) {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).not.toContain("secret: process.env.REVALIDATE_SECRET");
      expect(content).not.toContain("REVALIDATE_SECRET,");
    }
  });

  it("ADMIN_PASSWORD never hardcoded", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const srcDir = path.join(process.cwd(), "src");
    const files = getAllTsFiles(srcDir);

    for (const file of files) {
      if (file.includes("__tests__")) continue;
      const content = fs.readFileSync(file, "utf-8");
      expect(content).not.toMatch(/ADMIN_PASSWORD\s*=\s*["'][^"']+["']/);
    }
  });

  it("no NEXT_PUBLIC_ secrets in env files", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const envFiles = [".env", ".env.local", ".env.example"];
    for (const file of envFiles) {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).not.toContain("NEXT_PUBLIC_TOKKO_API_KEY");
      expect(content).not.toContain("NEXT_PUBLIC_REVALIDATE_SECRET");
      expect(content).not.toContain("NEXT_PUBLIC_ADMIN_PASSWORD");
    }
  });

  it("no console.log in production source code", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const srcDir = path.join(process.cwd(), "src");
    const files = getAllTsFiles(srcDir);

    for (const file of files) {
      if (file.includes("__tests__")) continue;
      const content = fs.readFileSync(file, "utf-8");
      expect(content).not.toContain("console.log(");
      expect(content).not.toContain("console.warn(");
    }
  });

  it("editorial internalNote never in sitemap", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const sitemapPath = path.join(process.cwd(), "src/app/sitemap.ts");
    if (!fs.existsSync(sitemapPath)) return;
    const content = fs.readFileSync(sitemapPath, "utf-8");
    expect(content).not.toContain("internalNote");
  });

  it("editorial internalNote never in JSON-LD", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const jsonLdPath = path.join(process.cwd(), "src/components/seo/JsonLd.tsx");
    if (!fs.existsSync(jsonLdPath)) return;
    const content = fs.readFileSync(jsonLdPath, "utf-8");
    expect(content).not.toContain("internalNote");
  });

  it("editorial internalNote never in home page", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const homePath = path.join(process.cwd(), "src/app/page.tsx");
    if (!fs.existsSync(homePath)) return;
    const content = fs.readFileSync(homePath, "utf-8");
    expect(content).not.toContain("internalNote");
  });

  it("editorial internalNote never in property detail page", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const detailPath = path.join(process.cwd(), "src/app/propiedades/[slug]/page.tsx");
    if (!fs.existsSync(detailPath)) return;
    const content = fs.readFileSync(detailPath, "utf-8");
    expect(content).not.toContain("internalNote");
  });

  it("no video iframes in any production component", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const prodComponents = [
      "src/components/property/PropertyHero.tsx",
      "src/components/property/PropertyMediaGallery.tsx",
      "src/components/property/PropertyVideoIndicator.tsx",
      "src/components/layout/Header.tsx",
      "src/components/sections/Hero.tsx",
      "src/app/page.tsx",
      "src/app/propiedades/[slug]/page.tsx",
      "src/app/propiedades/page.tsx",
    ];

    for (const file of prodComponents) {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).not.toContain("<iframe");
    }
  });

  it("no secret values from local env files leak into the repository", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const SECRET_KEYS = ["TOKKO_API_KEY", "REVALIDATE_SECRET", "ADMIN_PASSWORD", "ADMIN_JWT_SECRET"];
    const secrets: string[] = [];

    for (const envFile of [".env", ".env.local", ".env.production"]) {
      const envPath = path.join(process.cwd(), envFile);
      if (!fs.existsSync(envPath)) continue;
      for (const line of fs.readFileSync(envPath, "utf-8").split(/\r?\n/)) {
        const eq = line.indexOf("=");
        if (eq === -1) continue;
        const key = line.slice(0, eq).trim();
        const value = line.slice(eq + 1).trim();
        if (SECRET_KEYS.includes(key) && value.length >= 16) secrets.push(value);
      }
    }
    if (secrets.length === 0) return;

    const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "renders", "raw", "coverage"]);
    const SCAN_EXT = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".md", ".txt", ".yml", ".yaml"]);
    const leaks: string[] = [];

    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (!SKIP_DIRS.has(entry.name)) walk(fullPath);
          continue;
        }
        if (entry.name.startsWith(".env") && entry.name !== ".env.example") continue;
        if (!SCAN_EXT.has(path.extname(entry.name))) continue;
        const content = fs.readFileSync(fullPath, "utf-8");
        for (const secret of secrets) {
          if (content.includes(secret)) {
            leaks.push(path.relative(process.cwd(), fullPath));
            break;
          }
        }
      }
    };
    walk(process.cwd());

    expect(leaks, "secret values from .env files found in tracked files").toEqual([]);
  });

  it("env.example has correct variable names", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const envPath = path.join(process.cwd(), ".env.example");
    if (!fs.existsSync(envPath)) return;
    const content = fs.readFileSync(envPath, "utf-8");
    expect(content).toContain("TOKKO_API_KEY=");
    expect(content).toContain("TOKKO_BRANCH_ID=85101");
    expect(content).toContain("TOKKO_COMPANY_ID=47477");
    expect(content).toContain("REVALIDATE_SECRET=");
    expect(content).toContain("ADMIN_USERNAME=");
    expect(content).toContain("ADMIN_PASSWORD=");
    expect(content).toContain("ADMIN_JWT_SECRET=");
    expect(content).toContain("NEXT_PUBLIC_SITE_URL=https://firmacalamuchita.com");
    // .env.example should NOT contain actual credential values
    expect(content).not.toMatch(/ADMIN_USERNAME=.+@/);
    expect(content).not.toMatch(/ADMIN_PASSWORD=.+[A-Za-z0-9]{5,}/);
  });
});

function getAllTsFiles(dir: string): string[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fsSync = require("fs") as typeof import("fs");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pathMod = require("path") as typeof import("path");
  const files: string[] = [];

  const entries = fsSync.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = pathMod.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".next") {
      files.push(...getAllTsFiles(fullPath));
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      files.push(fullPath);
    }
  }

  return files;
}
