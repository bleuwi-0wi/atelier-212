'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore, FREE_SHIPPING_THRESHOLD } from '@/store/cart';
import { useUIStore } from '@/store/ui';
import { translations } from '@/data/translations';
import { formatPrice } from '@/lib/format';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Truck,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Tag,
  Check,
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getSubtotal, getShippingFee, getTotal } = useCartStore();
  const { language, showToast } = useUIStore();
  const t = translations[language];

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const total = getTotal();

  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === 'ATELIER20') {
      setAppliedPromo('ATELIER20');
      showToast('Code promo -20% activé pour votre commande WhatsApp !');
    } else {
      showToast('Code promo invalide. Essayez ATELIER20');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center mx-auto mb-6 text-brand-muted">
          <ShoppingBag className="w-10 h-10 opacity-40" />
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-4xl text-brand-text mb-3">
          {t.cart.emptyTitle}
        </h1>
        <p className="text-sm text-brand-muted max-w-md mx-auto mb-8">
          {t.cart.emptySubtitle}
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-brand bg-brand-text text-brand-bg text-xs font-semibold uppercase tracking-widest hover:bg-brand-accent hover:text-black transition-colors shadow-lift"
        >
          <span>{t.cart.continueShopping}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
          Récapitulatif
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-brand-text mt-1">
          {t.cart.title} ({items.reduce((acc, i) => acc + i.quantity, 0)})
        </h1>
      </div>

      {/* Free Shipping Alert Bar */}
      <div className="mb-8 p-4 rounded-brand bg-brand-surface border border-brand-border shadow-soft">
        <div className="flex items-center justify-between text-xs font-medium mb-2">
          <div className="flex items-center gap-2 text-brand-text">
            <Truck className="w-4 h-4 text-brand-accent" />
            <span>
              {remainingForFreeShipping === 0
                ? t.cart.freeShippingUnlocked
                : t.cart.freeShippingRemaining.replace('{amount}', formatPrice(remainingForFreeShipping))}
            </span>
          </div>
          <span className="font-bold text-brand-accent">{progress}%</span>
        </div>
        <div className="w-full bg-brand-bg h-2.5 rounded-full overflow-hidden border border-brand-border/60">
          <div
            className="bg-brand-accent h-full transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Two Column Layout: Items Table (7 cols) & Order Summary (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-brand-surface rounded-brand border border-brand-border divide-y divide-brand-border shadow-soft overflow-hidden">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between"
              >
                {/* Thumbnail & Basic Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative w-20 h-26 rounded-brand overflow-hidden shrink-0 bg-brand-bg border border-brand-border">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-heading font-bold text-base text-brand-text hover:text-brand-accent transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>

                    <div className="flex items-center gap-2 mt-1.5 text-xs text-brand-muted">
                      <span className="border border-brand-border px-2 py-0.5 rounded bg-brand-bg font-semibold">
                        Taille : {item.size}
                      </span>
                      <span className="flex items-center gap-1 border border-brand-border px-2 py-0.5 rounded bg-brand-bg">
                        <span>Couleur :</span>
                        <span
                          className="w-3 h-3 rounded-full border border-brand-border inline-block"
                          style={{ backgroundColor: item.color }}
                        />
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-brand-accent mt-2">
                      Prix unitaire : {formatPrice(item.price)}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-brand-border/40">
                  <div className="flex items-center border border-brand-border rounded-brand overflow-hidden bg-brand-bg">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                      className="p-2 hover:bg-brand-border/60 text-brand-text transition-colors"
                      aria-label="Diminuer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-brand-text">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                      className="p-2 hover:bg-brand-border/60 text-brand-text transition-colors"
                      aria-label="Augmenter"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="font-heading font-black text-base text-brand-text block">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id, item.size, item.color)}
                    className="p-2 text-brand-muted hover:text-red-500 transition-colors"
                    title={t.cart.remove}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              href="/shop"
              className="text-xs text-brand-muted hover:text-brand-accent transition-colors font-medium"
            >
              ← Continuer mes achats
            </Link>
          </div>
        </div>

        {/* Right: Summary Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-brand-surface rounded-brand border border-brand-border p-6 shadow-soft space-y-6">
            <h2 className="font-heading font-bold text-lg text-brand-text pb-3 border-b border-brand-border">
              Total de la Commande
            </h2>

            {/* Price breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-brand-muted">
                <span>{t.cart.subtotal}</span>
                <span className="font-semibold text-brand-text">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-brand-muted">
                <span>{t.cart.shipping}</span>
                <span className="font-semibold text-brand-text">
                  {shipping === 0 ? (
                    <span className="text-green-600 dark:text-green-400 font-bold">{t.cart.free}</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>

              {appliedPromo && (
                <div className="flex justify-between text-brand-accent font-semibold">
                  <span>Code Promo ({appliedPromo})</span>
                  <span>-20% appliqué</span>
                </div>
              )}

              <div className="pt-4 border-t border-brand-border flex justify-between text-lg font-black text-brand-text">
                <span>{t.cart.total}</span>
                <span className="text-brand-accent">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Code promo (ex: ATELIER20)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-brand bg-brand-bg border border-brand-border text-xs text-brand-text uppercase placeholder:normal-case focus:outline-none focus:border-brand-accent"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-brand bg-brand-bg border border-brand-border hover:border-brand-accent text-xs font-semibold uppercase text-brand-text transition-colors"
              >
                Appliquer
              </button>
            </form>

            {/* Checkout Button */}
            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-4 px-6 rounded-brand bg-brand-text text-brand-bg text-xs font-semibold uppercase tracking-[0.15em] hover:bg-brand-accent hover:text-black transition-all flex items-center justify-center gap-2 shadow-lift transform hover:-translate-y-0.5"
            >
              <span>Valider la Commande (Cash on Delivery)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Reassurance list */}
            <div className="pt-4 border-t border-brand-border space-y-2 text-[11px] text-brand-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Paiement en espèces à la livraison (Rien à payer en ligne)</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-brand-accent" />
                <span>Possibilité d’échanger la taille sous 7 jours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
