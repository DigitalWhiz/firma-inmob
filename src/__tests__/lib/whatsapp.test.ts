import { describe, it, expect } from "vitest";
import { getWhatsAppUrl, normalizePhone } from "@/lib/whatsapp";

describe("WhatsApp URL", () => {
  it("builds correct URL from Argentine phone", () => {
    const url = getWhatsAppUrl("+54 9 3571 60-9655");
    expect(url).toBe("https://wa.me/5493571609655");
  });

  it("builds URL with message", () => {
    const url = getWhatsAppUrl("+5493516195892", "Hola");
    expect(url).toBe("https://wa.me/5493516195892?text=Hola");
  });

  it("encodes message with special characters", () => {
    const url = getWhatsAppUrl("+5493516195892", "Hola, ¿cómo estás?");
    expect(url).toContain("text=Hola%2C%20%C2%BFc%C3%B3mo%20est%C3%A1s%3F");
  });

  it("strips all non-numeric characters", () => {
    const url = getWhatsAppUrl("+54 9 (3571) 60-9655");
    expect(url).toBe("https://wa.me/5493571609655");
  });

  it("works without message", () => {
    const url = getWhatsAppUrl("+5493546532779");
    expect(url).toBe("https://wa.me/5493546532779");
    expect(url).not.toContain("text=");
  });
});

describe("normalizePhone", () => {
  it("removes spaces", () => {
    expect(normalizePhone("+54 9 3571 60-9655")).toBe("5493571609655");
  });

  it("removes dashes", () => {
    expect(normalizePhone("+54-9-3571-60-9655")).toBe("5493571609655");
  });

  it("removes parentheses", () => {
    expect(normalizePhone("+54 (9) 3571-60-9655")).toBe("5493571609655");
  });

  it("removes plus sign", () => {
    expect(normalizePhone("+5493571609655")).toBe("5493571609655");
  });
});
