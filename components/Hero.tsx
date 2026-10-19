'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUIStore } from '@/store/ui';
import { translations } from '@/data/translations';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MOTION_CONFIG } from '@/lib/motion';

export default function Hero() {
  const { language } = useUIStore();
  const t = translations[language];
  const heroRef = useRef<HTMLDivElement>(null);

  // Subtle parallax effect on hero background
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  // Split headline into words for staggered reveal
  const headlineWords = t.hero.title.split(' ');

  const wordContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.045,
        delayChildren: 0.2,
      },
    },
  };

  const wordItemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: MOTION_CONFIG.ease,
      },
    },
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full h-[86vh] min-h-[580px] max-h-[820px] flex items-center justify-center overflow-hidden bg-[#111111]"
    >
      {/* Background Editorial Image with Slow Zoom-Out (1.1 to 1) and Scroll Parallax */}
      <motion.div
        style={{ y: backgroundY }}
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-[115%]"
      >
        <Image
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop"
          alt="Atelier 212 Streetwear Collection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-75 contrast-110"
        />
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[#faf8f5]">
        {/* Season Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: MOTION_CONFIG.ease }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-[0.25em] text-[#c8a46a] mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.hero.tagline}</span>
        </motion.div>

        {/* Big Headline (Reveals Word by Word) */}
        <motion.h1
          variants={wordContainerVariants}
          initial="hidden"
          animate="visible"
          className="font-heading font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto flex flex-wrap justify-center gap-x-3 gap-y-1"
        >
          {headlineWords.map((word, idx) => (
            <motion.span
              key={`${word}-${idx}`}
              variants={wordItemVariants}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle (Fades in after headline) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: MOTION_CONFIG.ease }}
          className="text-sm sm:text-base md:text-lg text-[#e8e4de]/90 max-w-2xl mx-auto mb-8 font-normal leading-relaxed"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* 2 CTA Buttons (Pops in last with press-down & scale) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75, ease: MOTION_CONFIG.ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/shop"
              className="btn-ripple w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-brand bg-[#c8a46a] text-black font-semibold text-xs uppercase tracking-[0.15em] hover:bg-[#d8b57b] transition-colors shadow-lift"
            >
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/shop?filter=new"
              className="btn-ripple w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-brand bg-white/10 hover:bg-white/20 text-[#faf8f5] font-semibold text-xs uppercase tracking-[0.15em] backdrop-blur-md border border-white/30 transition-colors"
            >
              <span>{t.hero.ctaSecondary}</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Moroccan Streetwear Coordinates Badge */}
      <div className="absolute bottom-6 left-6 hidden md:block text-xs text-white/60 tracking-widest font-mono">
        CASABLANCA — 33.5731° N, 7.5898° W
      </div>
      <div className="absolute bottom-6 right-6 hidden md:block text-xs text-white/60 tracking-widest">
        🇲🇦 LIVRAISON PARTOUT AU MAROC
      </div>
    </section>
  );
}
