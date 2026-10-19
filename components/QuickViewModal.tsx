'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUIStore } from '@/store/ui';
import { useCartStore } from '@/store/cart';
import { translations } from '@/data/translations';
import { formatPrice, calculateDiscount } from '@/lib/format';
import { X, ShoppingBag, Plus, Minus, Check, Star, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOTION_CONFIG, modalVariants } from '@/lib/motion';

export default function QuickViewModal() {
  const { quickViewProduct, closeQuickView, language, showToast, openCart, triggerFlyToCart } = useUIStore();
  const { addItem } = useCartStore();
  const t = translations[language];

  const product = quickViewProduct;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');
      setQuantity(1);
      setIsAdded(false);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && product) {
        closeQuickView();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, closeQuickView]);

  if (!product) return null;

  const discount = calculateDiscount(product.price, product.oldPrice);

  const handleAddToCart = () => {
    if (!product.inStock) return;

    // Trigger Fly to Cart animation using modal image coordinates
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      triggerFlyToCart(
        product.images[activeImageIndex] || product.images[0],
        rect.left + rect.width / 2,
        rect.top + rect.height / 3
      );
    }

    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[activeImageIndex] || product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    setIsAdded(true);
    showToast(t.product.addedToast);

    setTimeout(() => {
      setIsAdded(false);
      closeQuickView();
      openCart();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop with Fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={closeQuickView}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal Window with Fade + Scale from 0.96 */}
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-4xl bg-brand-surface rounded-brand shadow-modal border border-brand-border overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={closeQuickView}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-brand-bg/80 hover:bg-brand-border text-brand-text transition-colors"
            aria-label="Fermer l'aperçu"
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Left Gallery */}
          <div className="w-full md:w-1/2 p-6 flex flex-col gap-3 bg-brand-bg/30">
            {/* Active Image */}
            <div ref={imageRef} className="relative aspect-[3/4] w-full rounded-brand overflow-hidden bg-brand-bg border border-brand-border">
              <Image
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />

              {discount > 0 && (
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-brand-accent text-black">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 rounded-brand overflow-hidden shrink-0 border-2 transition-all ${
                      idx === activeImageIndex
                        ? 'border-brand-accent shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Info */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-brand-muted mb-2">
                <span className="uppercase tracking-widest font-semibold text-brand-accent">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-brand-text">{product.rating}</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-heading font-black text-xl sm:text-2xl text-brand-text mb-3">
                {product.name}
              </h2>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-heading font-black text-2xl text-brand-text">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-brand-muted line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Color Swatches */}
              <div className="mb-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-2">
                  {t.product.selectColor} :
                </label>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedColor === color
                          ? 'border-brand-accent ring-2 ring-brand-accent/30 shadow-sm'
                          : 'border-brand-border'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {selectedColor === color && (
                        <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-brand-text">
                    {t.product.selectSize} :
                  </label>
                  <Link
                    href="/policies/guide-des-tailles"
                    target="_blank"
                    className="text-[11px] text-brand-accent hover:underline"
                  >
                    {t.product.sizeGuide}
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 rounded-brand text-xs font-semibold uppercase tracking-wider border transition-all ${
                        selectedSize === size
                          ? 'border-brand-text bg-brand-text text-brand-bg shadow-sm'
                          : 'border-brand-border bg-brand-bg text-brand-text hover:border-brand-accent'
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-text">
                  {t.cart.qty} :
                </span>
                <div className="flex items-center border border-brand-border rounded-brand overflow-hidden bg-brand-bg">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-brand-border/60 text-brand-text transition-colors"
                    aria-label="Diminuer la quantité"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </motion.button>
                  <span className="px-4 text-xs font-bold text-brand-text">{quantity}</span>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 hover:bg-brand-border/60 text-brand-text transition-colors"
                    aria-label="Augmenter la quantité"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-brand-border space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={!product.inStock}
                onClick={handleAddToCart}
                className={`btn-ripple w-full py-3.5 px-6 rounded-brand font-semibold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-colors shadow-lift ${
                  product.inStock
                    ? isAdded
                      ? 'bg-green-600 text-white'
                      : 'bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-black'
                    : 'bg-brand-border text-brand-muted cursor-not-allowed'
                }`}
              >
                {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                <span>{isAdded ? 'Ajouté !' : product.inStock ? t.product.addToCart : t.product.soldOut}</span>
              </motion.button>

              <div className="text-center">
                <Link
                  href={`/product/${product.slug}`}
                  onClick={closeQuickView}
                  className="inline-flex items-center gap-1 text-xs text-brand-muted hover:text-brand-accent transition-colors py-1 group"
                >
                  <span>Voir la fiche produit complète</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
