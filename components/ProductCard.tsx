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
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOTION_CONFIG } from '@/lib/motion';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { language, openQuickView, showToast, openCart, triggerFlyToCart } = useUIStore();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const t = translations[language];

  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const cardImageRef = useRef<HTMLDivElement>(null);

  const isWishlisted = isInWishlist(product.id);
  const discount = calculateDiscount(product.price, product.oldPrice);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) return;

    // Trigger Fly to Cart animation using card coordinates
    if (cardImageRef.current) {
      const rect = cardImageRef.current.getBoundingClientRect();
      triggerFlyToCart(product.images[0], rect.left + rect.width / 2, rect.top + rect.height / 3);
    }

    // Add item
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: product.sizes[0] || 'M',
      color: product.colors[0] || '#111111',
      quantity: 1,
    });

    // Checkmark state
    setIsAdded(true);
    showToast(t.product.addedToast);

    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      whileHover={{ y: MOTION_CONFIG.cardHoverLift }}
      transition={{ duration: 0.25, ease: MOTION_CONFIG.ease }}
      className="group relative flex flex-col bg-brand-surface rounded-brand overflow-hidden border border-brand-border/70 hover:border-brand-accent/50 hover:shadow-lift transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with 1.06x Zoom & Crossfade */}
      <div ref={cardImageRef} className="relative aspect-[3/4] w-full overflow-hidden bg-brand-bg">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-[1.06] transition-transform duration-600 ease-out will-change-transform"
          />

          {/* Secondary image on hover */}
          {product.images[1] && (
            <div
              className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={product.images[1]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-[1.06] transition-transform duration-600 ease-out will-change-transform"
              />
            </div>
          )}
        </Link>

        {/* Badges on Top Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {!product.inStock && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-black/80 text-white backdrop-blur-sm">
              {t.product.soldOut}
            </span>
          )}
          {product.inStock && discount > 0 && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-brand-accent text-black shadow-sm">
              -{discount}%
            </span>
          )}
          {product.inStock && product.isNew && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-brand-text text-brand-bg shadow-sm">
              {t.product.newBadge}
            </span>
          )}
        </div>

        {/* Wishlist Button Top Right with Scale-Pop Animation */}
        <motion.button
          onClick={handleWishlistClick}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          animate={
            isWishlisted
              ? { scale: [1, 1.35, 1], transition: { duration: 0.35, ease: MOTION_CONFIG.easeElastic } }
              : { scale: 1 }
          }
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${
            isWishlisted
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-brand-text hover:text-red-500'
          }`}
          aria-label={isWishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </motion.button>

        {/* Action Buttons: Quick View & Slide-Up Add To Cart */}
        <div className="absolute inset-x-3 bottom-3 z-10 flex gap-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickViewClick}
            className="flex-1 py-2 px-3 rounded-brand bg-white/95 dark:bg-black/90 backdrop-blur-md text-brand-text text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-brand-accent hover:text-black transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Aperçu</span>
          </motion.button>

          {product.inStock && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleQuickAdd}
              className={`p-2 rounded-brand transition-all shrink-0 shadow-sm flex items-center justify-center ${
                isAdded
                  ? 'bg-green-600 text-white scale-105'
                  : 'bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-black'
              }`}
              title={isAdded ? 'Ajouté !' : t.product.addToCart}
              aria-label={t.product.addToCart}
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div key="bag" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <ShoppingBag className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-brand-muted mb-1">
            <span className="uppercase tracking-wider text-[11px] font-medium">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-[11px] font-bold text-brand-text">{product.rating}</span>
            </div>
          </div>

          {/* Product Name */}
          <Link
            href={`/product/${product.slug}`}
            className="font-semibold text-sm text-brand-text hover:text-brand-accent transition-colors line-clamp-1"
          >
            {product.name}
          </Link>

          {/* Colors Preview */}
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors.map((color, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full border border-brand-border/80 inline-block shadow-inner transition-transform hover:scale-125"
                style={{ backgroundColor: color }}
              />
            ))}
            <span className="text-[10px] text-brand-muted ml-1">
              {product.sizes.length} tailles
            </span>
          </div>
        </div>

        {/* Price & Cart status */}
        <div className="flex items-baseline justify-between pt-2 border-t border-brand-border/40">
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-black text-base text-brand-text">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-brand-muted line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <span className="text-[11px] font-medium text-brand-muted">
            {product.inStock ? 'En stock' : <span className="text-red-500 font-semibold">{t.product.soldOut}</span>}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
