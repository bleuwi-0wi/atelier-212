'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/ui';
import { useCartStore, FREE_SHIPPING_THRESHOLD } from '@/store/cart';
import { translations } from '@/data/translations';
import { formatPrice } from '@/lib/format';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOTION_CONFIG } from '@/lib/motion';

export default function CartDrawer() {
  const router = useRouter();
  const { isCartOpen, closeCart, language } = useUIStore();
  const { items, updateQuantity, removeItem, getSubtotal, getShippingFee, getTotal } = useCartStore();
  const t = translations[language];

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const total = getTotal();

  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const isFreeUnlocked = remainingForFreeShipping === 0;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop with Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-brand-surface shadow-2xl flex flex-col border-l border-brand-border"
            >
              {/* Header */}
              <div className="p-5 border-b border-brand-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-accent" />
                  <h3 className="font-heading text-lg font-bold text-brand-text">
                    {t.cart.title}
                  </h3>
                  <span className="text-xs bg-brand-bg px-2 py-0.5 rounded-full border border-brand-border text-brand-muted font-medium">
                    {items.reduce((acc, i) => acc + i.quantity, 0)}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeCart}
                  className="p-1.5 rounded-brand hover:bg-brand-border/40 text-brand-muted hover:text-brand-text transition-colors"
                  aria-label="Fermer le panier"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Free shipping progress bar with Celebration Pulse */}
              <div className="bg-brand-bg px-5 py-3 border-b border-brand-border text-xs">
                <div className="flex items-center justify-between mb-1.5 font-medium">
                  <span className={`flex items-center gap-1.5 ${isFreeUnlocked ? 'text-green-600 dark:text-green-400 font-bold' : 'text-brand-text'}`}>
                    {isFreeUnlocked ? (
                      <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-spin" />
                    ) : (
                      <Truck className="w-3.5 h-3.5 text-brand-accent" />
                    )}
                    {isFreeUnlocked
                      ? t.cart.freeShippingUnlocked
                      : t.cart.freeShippingRemaining.replace('{amount}', formatPrice(remainingForFreeShipping))}
                  </span>
                  <span className="text-brand-muted font-bold">{progress}%</span>
                </div>
                <div
                  className={`w-full bg-brand-border/70 h-2 rounded-full overflow-hidden ${
                    isFreeUnlocked ? 'shipping-celebration' : ''
                  }`}
                >
                  <motion.div
                    className={`h-full rounded-full ${isFreeUnlocked ? 'bg-green-500' : 'bg-brand-accent'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: MOTION_CONFIG.ease }}
                  />
                </div>
              </div>

              {/* Items List with Stagger & Smooth Delete Collapse */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-brand-border/50">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center mb-4 text-brand-muted">
                      <ShoppingBag className="w-8 h-8 opacity-40" />
                    </div>
                    <h4 className="font-heading text-lg font-bold text-brand-text mb-1">
                      {t.cart.emptyTitle}
                    </h4>
                    <p className="text-xs text-brand-muted max-w-xs mb-6">
                      {t.cart.emptySubtitle}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        closeCart();
                        router.push('/shop');
                      }}
                      className="btn-ripple px-6 py-2.5 rounded-brand bg-brand-text text-brand-bg text-xs font-semibold uppercase tracking-wider hover:bg-brand-accent transition-colors"
                    >
                      {t.cart.continueShopping}
                    </motion.button>
                  </motion.div>
                ) : (
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.size}-${item.color}`}
                        initial={{ opacity: 0, height: 0, y: 15 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -15, transition: { duration: 0.25 } }}
                        transition={{ duration: 0.35, ease: MOTION_CONFIG.ease }}
                        className="py-4 first:pt-0 last:pb-0 flex gap-4 overflow-hidden"
                      >
                        {/* Product Image */}
                        <div className="relative w-20 h-24 rounded-brand overflow-hidden shrink-0 bg-brand-bg border border-brand-border">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={`/product/${item.slug}`}
                                onClick={closeCart}
                                className="text-sm font-semibold text-brand-text hover:text-brand-accent transition-colors line-clamp-1"
                              >
                                {item.name}
                              </Link>
                              <motion.button
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.85 }}
                                onClick={() => removeItem(item.id, item.size, item.color)}
                                className="text-brand-muted hover:text-red-500 transition-colors p-1"
                                aria-label={t.cart.remove}
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>

                            {/* Options */}
                            <div className="flex items-center gap-2 mt-1 text-xs text-brand-muted">
                              <span className="border border-brand-border px-1.5 py-0.5 rounded bg-brand-bg">
                                {item.size}
                              </span>
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-brand-border inline-block shadow-inner"
                                style={{ backgroundColor: item.color }}
                                title={item.color}
                              />
                            </div>
                          </div>

                          {/* Quantity Stepper & Price */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-brand-border rounded-brand overflow-hidden bg-brand-bg">
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                                className="p-1.5 hover:bg-brand-border/60 text-brand-text transition-colors"
                                aria-label="Diminuer"
                              >
                                <Minus className="w-3 h-3" />
                              </motion.button>
                              <span className="px-3 text-xs font-semibold text-brand-text">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                                className="p-1.5 hover:bg-brand-border/60 text-brand-text transition-colors"
                                aria-label="Augmenter"
                              >
                                <Plus className="w-3 h-3" />
                              </motion.button>
                            </div>

                            <div className="text-sm font-bold text-brand-text">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer Summary & CTAs */}
              {items.length > 0 && (
                <div className="p-5 border-t border-brand-border bg-brand-bg space-y-3">
                  <div className="space-y-1.5 text-xs">
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
                    <div className="flex justify-between text-base font-bold text-brand-text pt-2 border-t border-brand-border">
                      <span>{t.cart.total}</span>
                      <span className="text-brand-accent">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        closeCart();
                        router.push('/checkout');
                      }}
                      className="btn-ripple w-full flex items-center justify-center gap-2 py-3 px-4 rounded-brand bg-brand-text text-brand-bg font-semibold text-xs uppercase tracking-wider hover:bg-brand-accent transition-colors shadow-lift"
                    >
                      <span>{t.cart.checkout}</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        closeCart();
                        router.push('/cart');
                      }}
                      className="w-full py-2.5 px-4 rounded-brand border border-brand-border bg-brand-surface text-brand-text font-medium text-xs uppercase tracking-wider hover:border-brand-accent transition-colors text-center"
                    >
                      {t.cart.viewCart}
                    </motion.button>
                  </div>

                  <p className="text-[11px] text-center text-brand-muted">
                    🚚 Paiement sécurisé à la livraison partout au Maroc
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
