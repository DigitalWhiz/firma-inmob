import { describe, it, expect } from "vitest";
import {
  ADVISORS,
  getAdvisorById,
  getAdvisorByPhone,
  getAdvisorWhatsAppUrl,
} from "@/data/advisors";

describe("Advisor Data", () => {
  it("has 3 advisors", () => {
    expect(ADVISORS).toHaveLength(3);
  });

  it("all advisors have required fields", () => {
    for (const advisor of ADVISORS) {
      expect(advisor.id).toBeTruthy();
      expect(advisor.name).toBeTruthy();
      expect(advisor.slug).toBeTruthy();
      expect(advisor.phone).toBeTruthy();
      expect(advisor.whatsappUrl).toContain("wa.me");
      expect(advisor.email).toContain("@");
    }
  });

  it("Sabina Acosta exists", () => {
    const sabina = getAdvisorById("sabina-acosta");
    expect(sabina).toBeDefined();
    expect(sabina!.name).toBe("Sabina Acosta");
  });

  it("Ezequiel Fernandez exists", () => {
    const ezequiel = getAdvisorById("ezequiel-fernandez");
    expect(ezequiel).toBeDefined();
    expect(ezequiel!.name).toBe("Ezequiel Fernandez");
  });

  it("Aldo Fabricatore exists", () => {
    const aldo = getAdvisorById("aldo-fabricatore");
    expect(aldo).toBeDefined();
    expect(aldo!.name).toBe("Aldo Fabricatore");
  });

  it("getAdvisorById returns undefined for unknown id", () => {
    expect(getAdvisorById("unknown")).toBeUndefined();
  });

  it("getAdvisorByPhone finds advisor by cleaned phone", () => {
    const advisor = getAdvisorByPhone("+54 9 3571 60-9655");
    expect(advisor).toBeDefined();
    expect(advisor!.name).toBe("Sabina Acosta");
  });

  it("getAdvisorByPhone returns undefined for unknown phone", () => {
    expect(getAdvisorByPhone("+1234567890")).toBeUndefined();
  });

  it("all advisors use institutional FIRMA email", () => {
    for (const advisor of ADVISORS) {
      expect(advisor.email).toBe("info@firmacalamuchita.com");
    }
  });

  it("WhatsApp URLs contain pre-filled messages", () => {
    for (const advisor of ADVISORS) {
      expect(advisor.whatsappUrl).toContain("text=");
    }
  });
});

describe("getAdvisorWhatsAppUrl", () => {
  it("returns WhatsApp URL with property context", () => {
    const url = getAdvisorWhatsAppUrl("sabina-acosta", "Casa en Villa Rumipal");
    expect(url).toContain("wa.me/");
    expect(url).toContain("text=");
    expect(decodeURIComponent(url)).toContain("Casa en Villa Rumipal");
    expect(decodeURIComponent(url)).toContain("FIRMA Calamuchita");
  });

  it("returns general message without property title", () => {
    const url = getAdvisorWhatsAppUrl("ezequiel-fernandez");
    expect(url).toContain("wa.me/");
    expect(decodeURIComponent(url)).toContain("FIRMA Calamuchita");
  });

  it("returns hash for unknown advisor", () => {
    const url = getAdvisorWhatsAppUrl("unknown");
    expect(url).toBe("#");
  });
});
