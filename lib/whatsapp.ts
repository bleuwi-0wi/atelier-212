import { CartItem, CheckoutFormData } from '@/types';
import { formatPrice } from './format';

export const STORE_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212612345678';
export const BRAND_NAME = 'ATELIER 212';

interface BuildOrderMessageParams {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: CheckoutFormData;
}

/**
 * Builds the WhatsApp direct chat link with a pre-filled structured order summary
 */
export function buildOrderWhatsAppUrl({
  orderId,
  items,
  subtotal,
  shipping,
  total,
  customer,
}: BuildOrderMessageParams): string {
  const itemsList = items
    .map(
      (item) =>
        `• *${item.name}*\n  Taille: ${item.size} | Couleur: ${item.color}\n  Qté: ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(item.quantity * item.price)}`
    )
    .join('\n\n');

  const message = `🛍️ *NOUVELLE COMMANDE #${orderId}*\n` +
    `_Boutique ${BRAND_NAME}_\n\n` +
    `👤 *Informations Client :*\n` +
    `• Nom : ${customer.fullName}\n` +
    `• Tél : ${customer.phone}\n` +
    `• Ville : ${customer.city}\n` +
    `• Adresse : ${customer.address}\n` +
    (customer.notes ? `• Remarques : ${customer.notes}\n` : '') +
    `\n📦 *Articles commandés :*\n` +
    `${itemsList}\n\n` +
    `💳 *Détails du paiement :*\n` +
    `• Sous-total : ${formatPrice(subtotal)}\n` +
    `• Livraison : ${shipping === 0 ? 'Gratuite (0 DH)' : formatPrice(shipping)}\n` +
    `• *Total à payer : ${formatPrice(total)}*\n` +
    `• Mode : Paiement Cash à la livraison (COD)\n\n` +
    `_Merci de me confirmer la prise en charge et l'expédition de ma commande. À très vite !_`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encoded}`;
}

/**
 * Builds quick support inquiry link
 */
export function buildSupportWhatsAppUrl(customText?: string): string {
  const text = customText || `Bonjour ${BRAND_NAME}, j'ai une question concernant vos produits et ma commande.`;
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
