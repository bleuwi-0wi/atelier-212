'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import { useUIStore } from '@/store/ui';
import { translations, MOROCCAN_CITIES } from '@/data/translations';
import { formatPrice, isValidMoroccanPhone } from '@/lib/format';
import { buildOrderWhatsAppUrl } from '@/lib/whatsapp';
import { CheckoutFormData } from '@/types';
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  MessageCircle,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const { items, getSubtotal, getShippingFee, getTotal, clearCart } = useCartStore();
  const { language } = useUIStore();
  const t = translations[language];

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const total = getTotal();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phone: '',
    city: 'Casablanca',
    address: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<{
    orderId: string;
    whatsAppUrl: string;
    total: number;
    customer: CheckoutFormData;
  } | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = t.checkout.errors.fullName;
    }

    if (!isValidMoroccanPhone(formData.phone)) {
      newErrors.phone = t.checkout.errors.phone;
    }

    if (!formData.city) {
      newErrors.city = t.checkout.errors.city;
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      newErrors.address = t.checkout.errors.address;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) return;

    setIsSubmitting(true);

    const orderId = `CMD-${Math.floor(1000 + Math.random() * 9000)}`;

    const whatsAppUrl = buildOrderWhatsAppUrl({
      orderId,
      items,
      subtotal,
      shipping,
      total,
      customer: formData,
    });

    setSubmittedOrder({
      orderId,
      whatsAppUrl,
      total,
      customer: { ...formData },
    });

    // Automatically trigger WhatsApp tab
    if (typeof window !== 'undefined') {
      window.open(whatsAppUrl, '_blank');
    }

    clearCart();
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  // If order is completed successfully
  if (isSubmitted && submittedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-brand-surface rounded-brand border border-brand-border p-8 sm:p-12 shadow-modal text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-brand-muted">
              {submittedOrder.orderId}
            </span>
            <h1 className="font-heading font-black text-2xl sm:text-4xl text-brand-text mt-1">
              {t.checkout.successTitle}
            </h1>
            <p className="text-sm text-brand-muted mt-2">
              {t.checkout.successSubtitle}
            </p>
          </div>

          <div className="p-4 rounded-brand bg-brand-bg border border-brand-border text-xs text-brand-muted space-y-2 text-left max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="font-medium text-brand-text">Destinataire :</span>
              <span>{submittedOrder.customer.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-brand-text">Téléphone :</span>
              <span>{submittedOrder.customer.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-brand-text">Ville :</span>
              <span>{submittedOrder.customer.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-brand-text">Total à payer :</span>
              <span className="font-bold text-brand-accent">{formatPrice(submittedOrder.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-brand-text">Paiement :</span>
              <span className="text-green-600 font-semibold">Espèces à la livraison</span>
            </div>
          </div>

          <p className="text-xs text-brand-muted max-w-md mx-auto leading-relaxed">
            {t.checkout.successNote}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={submittedOrder.whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-brand bg-[#25D366] text-white font-semibold text-xs uppercase tracking-wider hover:brightness-105 transition-all shadow-lift"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ouvrir la conversation WhatsApp</span>
            </a>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-brand border border-brand-border bg-brand-surface text-brand-text font-semibold text-xs uppercase tracking-wider hover:border-brand-accent transition-colors"
            >
              {t.checkout.backHome}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // If cart is empty and not submitted
  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-12 h-12 text-brand-muted mx-auto mb-4 opacity-40" />
        <h2 className="font-heading font-black text-2xl text-brand-text mb-2">
          Votre panier est actuellement vide
        </h2>
        <p className="text-xs text-brand-muted max-w-sm mx-auto mb-6">
          Ajoutez des articles à votre panier avant de procéder à la validation de votre commande.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-brand bg-brand-text text-brand-bg text-xs font-semibold uppercase tracking-wider hover:bg-brand-accent transition-colors"
        >
          <span>Parcourir la boutique</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
          Étape Finale
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-brand-text mt-1">
          {t.checkout.title}
        </h1>
        <p className="text-sm text-brand-muted mt-2">
          {t.checkout.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Customer & Delivery Form (7 Cols) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="bg-brand-surface rounded-brand border border-brand-border p-6 sm:p-8 shadow-soft space-y-6"
          >
            <h2 className="font-heading font-bold text-lg text-brand-text pb-3 border-b border-brand-border flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-accent" />
              <span>Adresse de Livraison au Maroc</span>
            </h2>

            {/* Nom complet */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1.5">
                {t.checkout.fullName} *
              </label>
              <motion.input
                animate={errors.fullName ? { x: [-6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
                transition={{ duration: 0.35 }}
                type="text"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                }}
                placeholder={t.checkout.fullNamePlaceholder}
                className={`w-full px-4 py-3 rounded-brand bg-brand-bg border text-xs sm:text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-all ${
                  errors.fullName ? 'border-red-500 ring-2 ring-red-500/20' : 'border-brand-border focus:border-brand-accent'
                }`}
              />
              {errors.fullName && (
                <div className="flex items-center gap-1 text-[11px] text-red-500 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.fullName}</span>
                </div>
              )}
            </div>

            {/* Téléphone & Ville (2 cols on sm) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1.5">
                  {t.checkout.phone} *
                </label>
                <motion.input
                  animate={errors.phone ? { x: [-6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
                  transition={{ duration: 0.35 }}
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  placeholder={t.checkout.phonePlaceholder}
                  className={`w-full px-4 py-3 rounded-brand bg-brand-bg border text-xs sm:text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-all ${
                    errors.phone ? 'border-red-500 ring-2 ring-red-500/20' : 'border-brand-border focus:border-brand-accent'
                  }`}
                />
                {errors.phone && (
                  <div className="flex items-center gap-1 text-[11px] text-red-500 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1.5">
                  {t.checkout.city} *
                </label>
                <motion.select
                  animate={errors.city ? { x: [-6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
                  transition={{ duration: 0.35 }}
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                    if (errors.city) setErrors({ ...errors, city: undefined });
                  }}
                  className={`w-full px-4 py-3 rounded-brand bg-brand-bg border text-xs sm:text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-all ${
                    errors.city ? 'border-red-500 ring-2 ring-red-500/20' : 'border-brand-border focus:border-brand-accent'
                  }`}
                >
                  {MOROCCAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </motion.select>
                {errors.city && (
                  <div className="flex items-center gap-1 text-[11px] text-red-500 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.city}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Adresse exacte */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1.5">
                {t.checkout.address} *
              </label>
              <motion.textarea
                animate={errors.address ? { x: [-6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
                transition={{ duration: 0.35 }}
                rows={3}
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  if (errors.address) setErrors({ ...errors, address: undefined });
                }}
                placeholder={t.checkout.addressPlaceholder}
                className={`w-full px-4 py-3 rounded-brand bg-brand-bg border text-xs sm:text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-all ${
                  errors.address ? 'border-red-500 ring-2 ring-red-500/20' : 'border-brand-border focus:border-brand-accent'
                }`}
              />
              {errors.address && (
                <div className="flex items-center gap-1 text-[11px] text-red-500 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.address}</span>
                </div>
              )}
            </div>

            {/* Instructions livraison */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1.5">
                {t.checkout.notes}
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={t.checkout.notesPlaceholder}
                className="w-full px-4 py-3 rounded-brand bg-brand-bg border border-brand-border text-xs sm:text-sm text-brand-text focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30 transition-all"
              />
            </div>

            {/* Payment Method Option (Cash on Delivery Default) */}
            <div className="pt-4 border-t border-brand-border">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-3">
                {t.checkout.paymentMethod}
              </label>

              <div className="p-4 rounded-brand border-2 border-brand-accent bg-brand-accent/5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-brand-text">
                    {t.checkout.codOption}
                  </h4>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                    {t.checkout.codDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isSubmitting}
              className="btn-ripple w-full py-4 px-6 rounded-brand bg-[#25D366] text-white font-bold text-xs uppercase tracking-widest hover:brightness-105 transition-all shadow-lift flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{t.checkout.confirmButton}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <p className="text-[11px] text-center text-brand-muted">
              {t.checkout.confirmDesc}
            </p>
          </form>
        </div>

        {/* Right: Order Summary (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="bg-brand-surface rounded-brand border border-brand-border p-6 shadow-soft space-y-5 sticky top-28">
            <h3 className="font-heading font-bold text-base text-brand-text pb-3 border-b border-brand-border">
              {t.checkout.orderSummary} ({items.length})
            </h3>

            {/* Items list */}
            <div className="divide-y divide-brand-border/60 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="py-3 flex items-center gap-3">
                  <div className="relative w-14 h-18 rounded-brand overflow-hidden shrink-0 bg-brand-bg border border-brand-border">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <h4 className="font-semibold text-brand-text truncate">{item.name}</h4>
                    <p className="text-brand-muted text-[11px]">
                      Taille: {item.size} • Qté: {item.quantity}
                    </p>
                    <p className="font-bold text-brand-accent mt-0.5">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-brand-border space-y-2 text-xs">
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
              <div className="pt-3 border-t border-brand-border flex justify-between text-base font-black text-brand-text">
                <span>{t.cart.total}</span>
                <span className="text-brand-accent">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="p-3 rounded-brand bg-brand-bg border border-brand-border text-[11px] text-brand-muted text-center">
              🇲🇦 Livraison rapide garantie sur toutes les villes du Royaume
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
