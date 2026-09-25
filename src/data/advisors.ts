export interface Advisor {
  id: string;
  name: string;
  slug: string;
  phone: string;
  whatsappUrl: string;
  email: string;
}

function buildWhatsAppUrl(phone: string, message?: string): string {
  const cleaned = phone.replace(/[^0-9]/g, "");
  const url = `https://wa.me/${cleaned}`;
  if (message) {
    return `${url}?text=${encodeURIComponent(message)}`;
  }
  return url;
}

const DEFAULT_MESSAGE = "Hola, quiero consultar por una propiedad de FIRMA Calamuchita.";

export const ADVISORS: Advisor[] = [
  {
    id: "sabina-acosta",
    name: "Sabina Acosta",
    slug: "sabina-acosta",
    phone: "+54 9 3571 60-9655",
    whatsappUrl: buildWhatsAppUrl("+5493571609655", DEFAULT_MESSAGE),
    email: "info@firmacalamuchita.com",
  },
  {
    id: "ezequiel-fernandez",
    name: "Ezequiel Fernandez",
    slug: "ezequiel-fernandez",
    phone: "+54 9 3516 19-5892",
    whatsappUrl: buildWhatsAppUrl("+5493516195892", DEFAULT_MESSAGE),
    email: "info@firmacalamuchita.com",
  },
  {
    id: "aldo-fabricatore",
    name: "Aldo Fabricatore",
    slug: "aldo-fabricatore",
    phone: "+54 9 3546 532779",
    whatsappUrl: buildWhatsAppUrl("+5493546532779", DEFAULT_MESSAGE),
    email: "info@firmacalamuchita.com",
  },
];

export function getAdvisorById(id: string): Advisor | undefined {
  return ADVISORS.find((a) => a.id === id);
}

export function getAdvisorByPhone(phone: string): Advisor | undefined {
  const cleaned = phone.replace(/[^0-9]/g, "");
  return ADVISORS.find((a) => a.phone.replace(/[^0-9]/g, "") === cleaned);
}

export function getAdvisorWhatsAppUrl(
  advisorId: string,
  propertyTitle?: string,
): string {
  const advisor = getAdvisorById(advisorId);
  if (!advisor) return "#";

  const message = propertyTitle
    ? `Hola, quiero consultar por la propiedad "${propertyTitle}" de FIRMA Calamuchita.`
    : DEFAULT_MESSAGE;

  return buildWhatsAppUrl(advisor.phone, message);
}
