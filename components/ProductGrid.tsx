'use client';

import React from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';
import { MOTION_CONFIG, staggerContainerVariants } from '@/lib/motion';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  maxItems?: number;
}

export default function ProductGrid({
  products,
  title,
  subtitle,
  maxItems,
}: ProductGridProps) {
  const displayProducts = maxItems ? products.slice(0, maxItems) : products;

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: MOTION_CONFIG.ease }}
          className="mb-10 text-center"
        >
          {subtitle && (
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
              {subtitle}
            </span>
          )}
          {title && (
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-brand-text mt-1">
              {title}
            </h2>
          )}
        </motion.div>
      )}

      {/* Grid with 80ms Staggered Children */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {displayProducts.map((product, idx) => (
          <motion.div
            key={product.id}
            variants={{
              hidden: { opacity: 0, y: 24, scale: 0.98 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 0.55,
                  delay: (idx % 4) * MOTION_CONFIG.staggerDelay,
                  ease: MOTION_CONFIG.ease,
                },
              },
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
