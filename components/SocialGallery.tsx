'use client';

import React from 'react';
import Image from 'next/image';
import { useUIStore } from '@/store/ui';
import { translations } from '@/data/translations';
import { Instagram, Heart, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOTION_CONFIG, sectionRevealVariants } from '@/lib/motion';

const SOCIAL_POSTS = [
  { id: 1, image: 'https://picsum.photos/seed/streetwear-ig-1/600/600', handle: '@atelier212', likes: '1.8k' },
  { id: 2, image: 'https://picsum.photos/seed/streetwear-ig-2/600/600', handle: '@atelier212', likes: '2.4k' },
  { id: 3, image: 'https://picsum.photos/seed/streetwear-ig-3/600/600', handle: '@atelier212', likes: '942' },
  { id: 4, image: 'https://picsum.photos/seed/streetwear-ig-4/600/600', handle: '@atelier212', likes: '3.1k' },
  { id: 5, image: 'https://picsum.photos/seed/streetwear-ig-5/600/600', handle: '@atelier212', likes: '1.2k' },
  { id: 6, image: 'https://picsum.photos/seed/streetwear-ig-6/600/600', handle: '@atelier212', likes: '4.5k' },
];

export default function SocialGallery() {
  const { language } = useUIStore();
  const t = translations[language];

  return (
    <motion.section
      variants={sectionRevealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
          Lookbook Communauté
        </span>
        <h2 className="font-heading font-black text-2xl sm:text-4xl text-brand-text mt-1">
          {t.social.title}
        </h2>
        <p className="text-sm text-brand-muted mt-2">
          {t.social.subtitle}
        </p>
      </div>

      {/* 6 Grid items with 80ms Stagger and Image Zoom Reveal */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {SOCIAL_POSTS.map((post, idx) => (
          <motion.a
            key={post.id}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.5,
              delay: idx * MOTION_CONFIG.staggerDelay,
              ease: MOTION_CONFIG.ease,
            }}
            whileHover={{ y: -4 }}
            className="group relative aspect-square rounded-brand overflow-hidden bg-brand-bg shadow-soft block"
          >
            <Image
              src={post.image}
              alt={`Atelier 212 Streetwear Look ${post.id}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover group-hover:scale-110 transition-transform duration-600 ease-out will-change-transform"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-white gap-2">
              <Instagram className="w-6 h-6 text-brand-accent transform group-hover:rotate-12 transition-transform duration-300" />
              <div className="flex items-center gap-1 text-xs font-bold">
                <Heart className="w-3.5 h-3.5 fill-current text-red-500" />
                <span>{post.likes}</span>
              </div>
              <span className="text-[10px] tracking-wider text-neutral-300">
                {post.handle}
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Bottom Button */}
      <div className="text-center mt-8">
        <motion.a
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ripple inline-flex items-center gap-2 px-6 py-2.5 rounded-brand border border-brand-border hover:border-brand-accent bg-brand-surface text-brand-text text-xs font-semibold uppercase tracking-wider transition-colors shadow-soft"
        >
          <Instagram className="w-4 h-4 text-brand-accent" />
          <span>{t.social.join}</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-50" />
        </motion.a>
      </div>
    </motion.section>
  );
}
