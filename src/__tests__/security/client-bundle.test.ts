import { describe, it, expect } from "vitest";

describe("Security — Client Bundle Audit", () => {
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

  it("no client component imports server-only modules", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const serverPatterns = [
      "process.env",
      "from \"fs\"",
      "from \"fs/promises\"",
      "from \"path\"",
      "from \"crypto\"",
      "from \"next/headers\"",
      "from \"@/lib/auth\"",
      "from \"@/lib/tokko\"",
      "from \"@/lib/editorial/store\"",
    ];

    for (const file of clientFiles) {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, "utf-8");
      for (const pattern of serverPatterns) {
        expect(content).not.toContain(pattern);
      }
    }
  });

  it("no client component receives secrets via props", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const secretProps = [
      "TOKKO_API_KEY",
      "REVALIDATE_SECRET",
      "ADMIN_PASSWORD",
      "password",
      "apiKey",
    ];

    for (const file of clientFiles) {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, "utf-8");
      for (const prop of secretProps) {
        expect(content).not.toMatch(new RegExp(`prop.*${prop}`, "i"));
      }
    }
  });

  it("no video iframes in production components", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const productionComponents = [
      "src/components/property/PropertyHero.tsx",
      "src/components/property/PropertyMediaGallery.tsx",
      "src/components/layout/Header.tsx",
      "src/components/sections/Hero.tsx",
      "src/components/property/WhatsAppStickyCTA.tsx",
    ];

    for (const file of productionComponents) {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).not.toContain("<iframe");
    }
  });

  it("PropertyVideoIndicator uses external link, not iframe", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const filePath = path.join(process.cwd(), "src/components/property/PropertyVideoIndicator.tsx");
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).not.toContain("<iframe");
    expect(content).toContain('target="_blank"');
    expect(content).toContain('rel="noopener noreferrer"');
  });

  it("deleted components do not exist", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const deletedComponents = [
      "src/components/property/PropertyVideoPlayer.tsx",
      "src/components/property/PropertyVideo.tsx",
      "src/components/property/Property360Viewer.tsx",
      "src/components/property/PropertyFeatures.tsx",
      "src/components/property/PropertyAgent.tsx",
    ];

    for (const file of deletedComponents) {
      const filePath = path.join(process.cwd(), file);
      expect(fs.existsSync(filePath)).toBe(false);
    }
  });
});
