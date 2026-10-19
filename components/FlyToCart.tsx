'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/ui';

export default function FlyToCart() {
  const { flyingItem, clearFlyingItem, triggerCartBump } = useUIStore();

  if (!flyingItem) return null;

  // Target cart button coordinates in header
  const targetX = typeof window !== 'undefined' ? window.innerWidth - 65 : 1000;
  const targetY = 25;

  return (
    <AnimatePresence>
      <motion.div
        key={`${flyingItem.startX}-${flyingItem.startY}`}
        initial={{
          position: 'fixed',
          left: flyingItem.startX,
          top: flyingItem.startY,
          width: 56,
          height: 70,
          opacity: 1,
          scale: 1,
          zIndex: 9999,
          pointerEvents: 'none',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        }}
        animate={{
          left: targetX,
          top: targetY,
          width: 16,
          height: 20,
          opacity: 0.2,
          scale: 0.3,
        }}
        transition={{
          duration: 0.65,
          ease: [0.2, 0.8, 0.2, 1],
        }}
        onAnimationComplete={() => {
          clearFlyingItem();
          triggerCartBump();
        }}
      >
        <Image
          src={flyingItem.image}
          alt="Adding to cart"
          fill
          sizes="56px"
          className="object-cover"
        />
      </motion.div>
    </AnimatePresence>
  );
}
