'use client';

import React from 'react';
import { useUIStore } from '@/store/ui';
import { translations } from '@/data/translations';
import { Truck, ShieldCheck, RotateCcw, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOTION_CONFIG } from '@/lib/motion';

export default function TrustBadges() {
  const { language } = useUIStore();
  const t = translations[language];

  const badges = [
    {
      icon: Truck,
      title: t.trust.shippingTitle,
      description: t.trust.shippingDesc,
    },
    {
      icon: ShieldCheck,
      title: t.trust.codTitle,
      description: t.trust.codDesc,
    },
    {
      icon: RotateCcw,
      title: t.trust.returnTitle,
      description: t.trust.returnDesc,
    },
    {
      icon: MessageCircle,
      title: t.trust.supportTitle,
      description: t.trust.supportDesc,
    },
  ];

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {badges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.55,
                delay: idx * MOTION_CONFIG.staggerDelay,
                ease: MOTION_CONFIG.ease,
              }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-brand bg-brand-surface border border-brand-border/80 shadow-soft hover:shadow-lift hover:border-brand-accent/50 transition-all duration-300 flex flex-col items-center text-center group cursor-default"
            >
              <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center text-brand-accent mb-4 group-hover:scale-115 group-hover:bg-brand-accent group-hover:text-black transition-all duration-300">
                <Icon className="w-6 h-6" />
              </div>

              <h3 className="font-heading font-bold text-base text-brand-text mb-1">
                {badge.title}
              </h3>

              <p className="text-xs text-brand-muted leading-relaxed">
                {badge.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
