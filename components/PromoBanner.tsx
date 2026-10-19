'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useUIStore } from '@/store/ui';
import { translations } from '@/data/translations';
import { Clock, Copy, Check, ArrowRight, Flame } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MOTION_CONFIG, sectionRevealVariants } from '@/lib/motion';

export default function PromoBanner() {
  const { language, showToast } = useUIStore();
  const t = translations[language];
  const bannerRef = useRef<HTMLElement>(null);

  // Subtle parallax effect on promo banner
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ['start end', 'end start'],
  });

  const glowY = useTransform(scrollYProgress, [0, 1], [-25, 25]);

  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(t.promo.code);
    setCopied(true);
    showToast('Code promo ATELIER20 copié !');
    setTimeout(() => setCopied(false), 2500);
  };

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <motion.section
      ref={bannerRef}
      variants={sectionRevealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="relative overflow-hidden my-16 sm:my-24 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#171717] via-[#111111] to-[#0a0a0a] text-white border-y border-[#262626]"
    >
      {/* Background Ambient Glow with Parallax */}
      <motion.div
        style={{ y: glowY }}
        className="absolute top-0 right-1/4 w-96 h-96 bg-[#c8a46a]/15 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left: Text & Coupon */}
        <div className="text-center lg:text-left max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c8a46a]/20 border border-[#c8a46a]/30 text-xs font-bold uppercase tracking-widest text-[#c8a46a] mb-4">
            <Flame className="w-3.5 h-3.5" />
            <span>{t.promo.badge}</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight mb-4">
            {t.promo.title}
          </h2>

          <p className="text-sm text-neutral-300 leading-relaxed mb-6">
            {t.promo.subtitle}
          </p>

          {/* Promo Code Box */}
          <div className="inline-flex items-center gap-3 p-1.5 pl-4 rounded-brand bg-white/10 backdrop-blur-md border border-white/20">
            <span className="font-mono font-bold text-sm tracking-widest text-[#c8a46a]">
              {t.promo.code}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyCode}
              className="btn-ripple flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-[#c8a46a] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-700" />
                  <span>Copié</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Right: Live Countdown Blocks & CTA */}
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-neutral-400 mb-3 uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5 text-[#c8a46a]" />
              <span>{t.promo.endsIn}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              {[
                { label: t.promo.days, value: timeLeft.days },
                { label: t.promo.hours, value: timeLeft.hours },
                { label: t.promo.mins, value: timeLeft.minutes },
                { label: t.promo.secs, value: timeLeft.seconds },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="bg-neutral-900/90 border border-neutral-700/70 rounded-brand p-3 sm:p-4 min-w-[65px] sm:min-w-[85px] shadow-soft"
                >
                  <span className="block font-heading font-black text-2xl sm:text-4xl text-[#c8a46a]">
                    {formatNumber(item.value)}
                  </span>
                  <span className="block text-[10px] uppercase tracking-wider text-neutral-400 font-medium mt-1">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/shop"
              className="btn-ripple w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-brand bg-[#c8a46a] text-black font-semibold text-xs uppercase tracking-widest hover:bg-[#d8b57b] transition-colors shadow-lift"
            >
              <span>{t.promo.shopNow}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
