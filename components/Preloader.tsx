'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/ui';
import { MOTION_CONFIG } from '@/lib/motion';

export default function Preloader() {
  const [shouldShow, setShouldShow] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const setPreloaderFinished = useUIStore((state) => state.setPreloaderFinished);

  useEffect(() => {
    let hasSeenPreloader = false;
    try {
      hasSeenPreloader = sessionStorage.getItem('atelier212_intro_seen') === 'true';
    } catch {
      hasSeenPreloader = false;
    }

    if (!hasSeenPreloader) {
      setShouldShow(true);
      const timer = setTimeout(() => {
        setIsCompleted(true);
        setPreloaderFinished(true);
        try {
          sessionStorage.setItem('atelier212_intro_seen', 'true');
        } catch {
          // ignore storage error
        }
      }, 1100);

      return () => clearTimeout(timer);
    } else {
      setPreloaderFinished(true);
    }
  }, [setPreloaderFinished]);

  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      {!isCompleted && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.65, ease: MOTION_CONFIG.ease },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#111111] text-[#faf8f5] select-none"
        >
          {/* Brand Logo with Scale & Fade */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: MOTION_CONFIG.ease }}
            className="text-center"
          >
            <span className="font-heading font-black text-3xl sm:text-4xl tracking-[0.25em] text-[#faf8f5] block">
              ATELIER 212
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#c8a46a] mt-1 block font-medium">
              Casablanca
            </span>
          </motion.div>

          {/* Thin Progress Line */}
          <div className="w-48 sm:w-60 h-[2px] bg-white/10 rounded-full overflow-hidden mt-8">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
              className="h-full bg-[#c8a46a]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
