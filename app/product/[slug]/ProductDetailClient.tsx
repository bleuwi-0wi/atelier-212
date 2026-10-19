'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useUIStore } from '@/store/ui';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { translations } from '@/data/translations';
import { formatPrice, calculateDiscount } from '@/lib/format';
import ProductGrid from '@/components/ProductGrid';
import {
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  X,
  Ruler,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOTION_CONFIG, modalVariants } from '@/lib/motion';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { language, showToast, openCart, triggerFlyToCart } = useUIStore();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const t = translations[language];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '#111111');
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const mainImageRef = useRef<HTMLDivElement>(null);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  const isWishlisted = isInWishlist(product.id);
  const discount = calculateDiscount(product.price, product.oldPrice);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;

    if (mainImageRef.current) {
      const rect = mainImageRef.current.getBoundingClientRect();
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
      openCart();
    }, 500);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Lien du produit copié dans le presse-papier !');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-brand-muted mb-8">
        <Link href="/" className="hover:text-brand-text transition-colors">
          Accueil
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-text transition-colors">
          Boutique
        </Link>
        <span>/</span>
        <Link
          href={`/shop?category=${product.category}`}
          className="hover:text-brand-text transition-colors capitalize"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-brand-text font-semibold truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-20">
        {/* Left: Gallery (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails list */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[620px] pb-2 sm:pb-0 scrollbar-none">
            {product.images.map((img, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-18 h-24 sm:w-20 sm:h-26 rounded-brand overflow-hidden shrink-0 border-2 transition-all ${
                  idx === activeImageIndex
                    ? 'border-brand-accent shadow-sm'
                    : 'border-brand-border/60 opacity-60 hover:opacity-100'
                }`}
                aria-label={`Photo ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${idx}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </motion.button>
            ))}
          </div>

          {/* Main Zoomable Image */}
          <div
            ref={mainImageRef}
            className="relative flex-1 aspect-[3/4] rounded-brand overflow-hidden bg-brand-bg border border-brand-border cursor-crosshair group shadow-soft"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <Image
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className={`object-cover transition-transform duration-200 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : undefined
              }
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
              {!product.inStock && (
                <span className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-black/80 text-white backdrop-blur-sm">
                  {t.product.soldOut}
                </span>
              )}
              {discount > 0 && (
                <span className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-brand-accent text-black">
                  -{discount}%
                </span>
              )}
              {product.isNew && (
                <span className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-brand-text text-brand-bg">
                  {t.product.newBadge}
                </span>
              )}
            </div>

            <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 text-white text-[10px] uppercase tracking-wider font-mono opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none">
              Survoler pour zoomer
            </div>
          </div>
        </div>

        {/* Right: Product Actions (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Top row: Category, rating, wishlist & share */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent">
                {product.category}
              </span>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="p-2 rounded-full border border-brand-border hover:border-brand-accent text-brand-muted hover:text-brand-text transition-colors"
                  title="Partager"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  animate={
                    isWishlisted
                      ? { scale: [1, 1.35, 1], transition: { duration: 0.35, ease: MOTION_CONFIG.easeElastic } }
                      : { scale: 1 }
                  }
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-full border transition-colors ${
                    isWishlisted
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'border-brand-border text-brand-muted hover:text-red-500 hover:border-red-500'
                  }`}
                  aria-label="Ajouter aux favoris"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </motion.button>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-brand-text mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating stars */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-brand-border'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-brand-text">{product.rating}</span>
              <span className="text-xs text-brand-muted">(38 avis vérifiés)</span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mb-6 p-4 rounded-brand bg-brand-surface border border-brand-border shadow-soft">
              <span className="font-heading font-black text-2xl sm:text-3xl text-brand-text">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-base text-brand-muted line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              <span className="text-xs font-medium text-green-600 dark:text-green-400 ml-auto">
                {product.inStock ? '✓ En stock à Casablanca' : '✕ Rupture temporaire'}
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Color Swatches */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-2.5">
                Couleur : <span className="text-brand-muted font-normal">{selectedColor}</span>
              </label>
              <div className="flex gap-2.5">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <motion.button
                      key={color}
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-brand-accent ring-2 ring-brand-accent/40 shadow-sm'
                          : 'border-brand-border'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {isSelected && (
                        <Check className="w-4 h-4 text-white mix-blend-difference" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector with Modal Link */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-text">
                  Taille : <span className="font-bold text-brand-accent">{selectedSize}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-xs text-brand-accent hover:underline font-medium"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Guide des tailles</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <motion.button
                      key={size}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[50px] h-11 px-3.5 rounded-brand text-xs font-bold uppercase tracking-wider border transition-all ${
                        isSelected
                          ? 'bg-brand-text text-brand-bg border-brand-text shadow-sm'
                          : 'bg-brand-bg text-brand-text border-brand-border hover:border-brand-accent'
                      }`}
                    >
                      {size}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart Button */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-brand-border rounded-brand overflow-hidden bg-brand-surface h-12 shadow-sm">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 h-full hover:bg-brand-border/40 text-brand-text transition-colors"
                  aria-label="Diminuer"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <span className="px-4 text-sm font-bold text-brand-text">{quantity}</span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 h-full hover:bg-brand-border/40 text-brand-text transition-colors"
                  aria-label="Augmenter"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={!product.inStock}
                onClick={handleAddToCart}
                className={`btn-ripple flex-1 h-12 px-6 rounded-brand font-semibold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-colors shadow-lift ${
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
            </div>

            {/* Fast Moroccan Reassurance */}
            <div className="p-4 rounded-brand bg-brand-bg border border-brand-border/80 text-xs space-y-2 mb-8 shadow-soft">
              <div className="flex items-center gap-2 text-brand-text font-medium">
                <Truck className="w-4 h-4 text-brand-accent" />
                <span>Livraison en 24h à Casablanca, 48h partout au Maroc</span>
              </div>
              <div className="flex items-center gap-2 text-brand-text font-medium">
                <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Paiement en espèces à la livraison (Cash on Delivery)</span>
              </div>
              <div className="flex items-center gap-2 text-brand-text font-medium">
                <RotateCcw className="w-4 h-4 text-brand-accent" />
                <span>Échanges faciles de taille sous 7 jours</span>
              </div>
            </div>

            {/* Accordions with Animated Height Collapse */}
            <div className="border-t border-brand-border divide-y divide-brand-border text-xs">
              {/* Confection Details */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('details')}
                  className="w-full flex items-center justify-between text-left font-semibold text-brand-text uppercase tracking-wider py-1"
                >
                  <span>{t.product.detailsTitle}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      openAccordion === 'details' ? 'rotate-180 text-brand-accent' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openAccordion === 'details' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: MOTION_CONFIG.ease }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 pb-1 text-brand-muted leading-relaxed space-y-1">
                        {product.details?.map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-brand-accent font-bold">•</span>
                            <span>{item}</span>
                          </div>
                        )) || <p>Confectionné au Maroc selon des normes strictes de qualité textile.</p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Shipping & Returns */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between text-left font-semibold text-brand-text uppercase tracking-wider py-1"
                >
                  <span>{t.product.shippingReturnsTitle}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      openAccordion === 'shipping' ? 'rotate-180 text-brand-accent' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openAccordion === 'shipping' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: MOTION_CONFIG.ease }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 pb-1 text-brand-muted leading-relaxed space-y-2">
                        <p>
                          <strong>Casablanca & Régions :</strong> Livraison le lendemain (24h).
                        </p>
                        <p>
                          <strong>Rabat, Tanger, Marrakech, Fès, Agadir :</strong> Livraison sous 24 à 48h.
                        </p>
                        <p>
                          <strong>Tarif :</strong> Gratuit dès 500 DH d’achat (sinon 40 DH). Vous pouvez essayer ou inspecter le colis lors de la remise par le livreur.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Care Instructions */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('care')}
                  className="w-full flex items-center justify-between text-left font-semibold text-brand-text uppercase tracking-wider py-1"
                >
                  <span>{t.product.careTitle}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      openAccordion === 'care' ? 'rotate-180 text-brand-accent' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openAccordion === 'care' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: MOTION_CONFIG.ease }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 pb-1 text-brand-muted leading-relaxed space-y-1">
                        {product.care?.map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-brand-accent font-bold">•</span>
                            <span>{item}</span>
                          </div>
                        )) || <p>Lavage machine à 30°C sur l’envers. Ne pas sécher au tambour.</p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <section className="pt-16 border-t border-brand-border">
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            Complétez Votre Silhouette
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-brand-text mt-1">
            {t.product.relatedTitle}
          </h2>
        </div>
        <ProductGrid products={relatedProducts} />
      </section>

      {/* Size Guide Modal with Fade + Scale from 0.96 & Backdrop Blur */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-lg bg-brand-surface rounded-brand border border-brand-border p-6 shadow-modal z-10"
            >
              <div className="flex items-center justify-between mb-4 border-b border-brand-border pb-3">
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-brand-accent" />
                  <h3 className="font-heading font-bold text-lg text-brand-text">
                    Guide des Tailles Streetwear (cm)
                  </h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="p-1 rounded hover:bg-brand-border/40 text-brand-muted hover:text-brand-text"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <p className="text-xs text-brand-muted mb-4">
                Nos pièces ont une coupe boxy contemporaine légèrement oversize. Si vous préférez une coupe ajustée, nous vous recommandons de choisir une taille en-dessous.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-brand-border text-brand-text font-bold">
                      <th className="py-2">Taille</th>
                      <th className="py-2">Poitrine (cm)</th>
                      <th className="py-2">Épaules (cm)</th>
                      <th className="py-2">Longueur (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/50 text-brand-muted">
                    <tr>
                      <td className="py-2 font-bold text-brand-text">S</td>
                      <td className="py-2">108 - 112</td>
                      <td className="py-2">52</td>
                      <td className="py-2">68</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-brand-text">M</td>
                      <td className="py-2">114 - 118</td>
                      <td className="py-2">54</td>
                      <td className="py-2">71</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-brand-text">L</td>
                      <td className="py-2">120 - 124</td>
                      <td className="py-2">56</td>
                      <td className="py-2">74</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-brand-text">XL</td>
                      <td className="py-2">126 - 130</td>
                      <td className="py-2">58</td>
                      <td className="py-2">76</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 text-center">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="btn-ripple px-6 py-2 rounded-brand bg-brand-text text-brand-bg text-xs font-semibold uppercase tracking-wider"
                >
                  Compris
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
