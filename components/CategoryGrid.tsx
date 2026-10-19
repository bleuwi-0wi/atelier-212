'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUIStore } from '@/store/ui';
import { categories } from '@/data/categories';
import { translations } from '@/data/translations';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { MOTION_CONFIG, sectionRevealVariants } from '@/lib/motion';

export default function CategoryGrid() {
  const { language } = useUIStore();
  const t = translations[language];

  const getGridSpanClass = (index: number) => {
    switch (index) {
      case 0:
        return 'md:col-span-7 md:row-span-2 h-[380px] md:h-[500px]';
      case 1:
        return 'md:col-span-5 md:row-span-2 h-[380px] md:h-[500px]';
      case 2:
        return 'md:col-span-4 h-[300px] md:h-[360px]';
      case 3:
        return 'md:col-span-4 h-[300px] md:h-[360px]';
      case 4:
        return 'md:col-span-4 h-[300px] md:h-[360px]';
      default:
        return 'md:col-span-4 h-[300px]';
    }
  };

  return (
    <motion.section
      variants={sectionRevealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            Vestiaire
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-brand-text mt-1">
            {t.categories.title}
          </h2>
          <p className="text-sm text-brand-muted mt-2 max-w-xl">
            {t.categories.subtitle}
          </p>
        </div>
        <Link
          href="/shop"
          className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-text hover:text-brand-accent transition-colors group"
        >
          <span>{t.categories.viewAll}</span>
          <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* 5 Tiles Bento Grid with 80ms Stagger and Image Reveal */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.6,
              delay: idx * MOTION_CONFIG.staggerDelay,
              ease: MOTION_CONFIG.ease,
            }}
            whileHover={{ y: -4 }}
            className={`group relative rounded-brand overflow-hidden shadow-soft cursor-pointer transition-shadow duration-300 hover:shadow-lift ${getGridSpanClass(
              idx
            )}`}
          >
            <Link href={`/shop?category=${cat.slug}`} className="block w-full h-full">
              {/* Background Image with Reveal and Scale Effect */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out will-change-transform"
                />
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 group-hover:from-black/90 transition-colors duration-300" />
              </div>

              {/* Tile Content */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-black text-2xl sm:text-3xl text-white group-hover:text-brand-accent transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-white/70 tracking-widest uppercase font-mono mt-1">
                      {cat.count} Modèles
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-brand-accent group-hover:text-black transition-all duration-300 transform group-hover:scale-110">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
