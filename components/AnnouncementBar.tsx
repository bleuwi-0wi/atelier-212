'use client';

import React, { useState, useEffect } from 'react';
import { useUIStore } from '@/store/ui';
import { translations } from '@/data/translations';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOTION_CONFIG } from '@/lib/motion';

export default function AnnouncementBar() {
  const { language } = useUIStore();
  const t = translations[language];
  const messages = t.announcements;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [messages.length]);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % messages.length);
  };

  return (
    <div className="bg-[#111111] text-[#faf8f5] py-2 px-4 text-xs font-medium tracking-wide border-b border-[#222222] select-none relative z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          className="p-1 hover:text-[#c8a46a] transition-colors"
          aria-label="Message précédent"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </motion.button>

        <div className="h-5 overflow-hidden flex items-center justify-center flex-1 mx-2 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index + language}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: MOTION_CONFIG.ease }}
              className="flex items-center gap-2 text-center"
            >
              <Sparkles className="w-3 h-3 text-[#c8a46a] hidden sm:inline-block" />
              <span className="font-medium tracking-wider text-[11px] sm:text-xs">
                {messages[index]}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          className="p-1 hover:text-[#c8a46a] transition-colors"
          aria-label="Message suivant"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </div>
  );
}
