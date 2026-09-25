/**
 * Builds a WhatsApp click-to-chat URL.
 * Phone numbers must be in international format without spaces or dashes.
 *
 * @param phone - Phone in any format (will be cleaned)
 * @param message - Optional pre-filled message
 * @returns WhatsApp URL ready for <a href>
 */
export function getWhatsAppUrl(phone: string, message?: string): string {
  const cleaned = phone.replace(/[^0-9]/g, "");
  const url = `https://wa.me/${cleaned}`;
  if (message) {
    return `${url}?text=${encodeURIComponent(message)}`;
  }
  return url;
}

/**
 * Normalizes an Argentine phone number to WhatsApp format.
 * Removes spaces, dashes, parentheses, and leading + if present.
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}
