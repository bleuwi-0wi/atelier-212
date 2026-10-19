/**
 * Formats a numeric price into Moroccan Dirhams (MAD / DH).
 * Example: 450 -> "450 DH"
 */
export function formatPrice(price: number): string {
  if (isNaN(price)) return '0 DH';
  return `${new Intl.NumberFormat('fr-FR').format(price)} DH`;
}

/**
 * Calculates discount percentage between oldPrice and price
 */
export function calculateDiscount(price: number, oldPrice?: number): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/**
 * Validates Moroccan phone numbers.
 * Supports formats:
 * - 0612345678 or 0712345678
 * - +212612345678 or +212712345678
 * - 0522123456 (landline)
 */
export function isValidMoroccanPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  // Matches Moroccan mobile and landline patterns
  const regex = /^(?:\+212|0)(?:[5-7])[0-9]{8}$/;
  return regex.test(cleaned);
}

/**
 * Normalizes phone number to international WhatsApp format (e.g. 2126XXXXXXXX)
 */
export function normalizeMoroccanPhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '212' + cleaned.substring(1);
  } else if (cleaned.startsWith('+212')) {
    cleaned = cleaned.substring(1);
  }
  return cleaned;
}
