'use client';

import React, { useState, useEffect, useRef } from 'react';
import { reviews } from '@/data/reviews';
import { useUIStore } from '@/store/ui';
import { translations } from '@/data/translations';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Quote, Users, Award, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { MOTION_CONFIG, sectionRevealVariants } from '@/lib/motion';

function AnimatedCounter({ end, duration = 1.5, decimals = 0, suffix = '' }: { end: number; duration?: number; decimals?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const startVal = 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Ease out quartic
      const easeVal = 1 - Math.pow(1 - progress, 4);
      setCount(startVal + easeVal * (end - startVal));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
      {suffix}
    </span>
  );
}

export default function Reviews() {
  const { language } = useUIStore();
  const t = translations[language];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  useEffect(() => {
    const timer = setInterval(nextReview, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = reviews[currentIndex];

  return (
    <motion.section
      variants={sectionRevealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 sm:py-24 bg-brand-surface border-y border-brand-border"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            Expérience Client
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-brand-text mt-1">
            {t.reviews.title}
          </h2>
          <p className="text-sm text-brand-muted mt-2">
            {t.reviews.subtitle}
          </p>
        </div>

        {/* Live Counting Stats Banner */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-10 p-4 sm:p-6 rounded-brand bg-brand-bg border border-brand-border text-center shadow-soft">
          <div>
            <div className="font-heading font-black text-xl sm:text-3xl text-brand-text">
              <AnimatedCounter end={3500} suffix="+" />
            </div>
            <span className="text-[11px] sm:text-xs text-brand-muted mt-0.5 block">
              Clients Livrés au Maroc
            </span>
          </div>

          <div>
            <div className="font-heading font-black text-xl sm:text-3xl text-brand-accent flex items-center justify-center gap-1">
              <AnimatedCounter end={4.9} decimals={1} />
              <Star className="w-4 h-4 fill-current inline-block" />
            </div>
            <span className="text-[11px] sm:text-xs text-brand-muted mt-0.5 block">
              Note Moyenne Certifiée
            </span>
          </div>

          <div>
            <div className="font-heading font-black text-xl sm:text-3xl text-brand-text">
              <AnimatedCounter end={100} suffix="%" />
            </div>
            <span className="text-[11px] sm:text-xs text-brand-muted mt-0.5 block">
              Paiement à la Livraison
            </span>
          </div>
        </div>

        {/* Carousel Card with Smooth Fade/Slide */}
        <div className="relative bg-brand-bg rounded-brand border border-brand-border p-8 sm:p-12 shadow-soft min-h-[300px] flex flex-col justify-between">
          <Quote className="absolute top-6 right-6 w-12 h-12 text-brand-border/60 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: MOTION_CONFIG.ease }}
              className="relative z-10"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-500 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < current.rating ? 'fill-current' : 'text-brand-border'
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="text-base sm:text-lg md:text-xl text-brand-text font-normal leading-relaxed mb-6 italic">
                &ldquo;{current.comment}&rdquo;
              </blockquote>

              {/* Author & City */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-brand-border/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-base text-brand-text">
                      {current.author}
                    </span>
                    {current.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.reviews.verifiedBuyer}</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-brand-muted">
                    {current.city} — {current.date}
                  </span>
                </div>

                {current.productName && (
                  <div className="text-xs text-brand-accent font-medium">
                    Acheté : {current.productName}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8 pt-4">
            {/* Dots */}
            <div className="flex gap-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-6 bg-brand-accent'
                      : 'w-1.5 bg-brand-border hover:bg-brand-muted'
                  }`}
                  aria-label={`Aller au témoignage ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevReview}
                className="p-2 rounded-full border border-brand-border bg-brand-surface hover:bg-brand-border/60 text-brand-text transition-colors"
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextReview}
                className="p-2 rounded-full border border-brand-border bg-brand-surface hover:bg-brand-border/60 text-brand-text transition-colors"
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
