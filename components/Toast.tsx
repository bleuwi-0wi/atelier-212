'use client';

import React, { useEffect } from 'react';
import { useUIStore } from '@/store/ui';
import { CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOTION_CONFIG } from '@/lib/motion';

export default function Toast() {
  const { toastMessage, hideToast } = useUIStore();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, hideToast]);

  return (
    <AnimatePresence>
      {toastMessage && (
        <aside aria-label="Notifications" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ duration: 0.3, ease: MOTION_CONFIG.ease }}
            className="relative overflow-hidden pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-brand bg-brand-text text-brand-bg shadow-modal border border-brand-border/30 text-xs font-semibold"
          >
            <CheckCircle className="w-4 h-4 text-brand-accent shrink-0" />
            <span>{toastMessage}</span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={hideToast}
              className="p-1 -mr-1 rounded hover:bg-white/20 transition-colors text-brand-bg/70 hover:text-brand-bg"
              aria-label="Fermer la notification"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>

            {/* Auto-Dismiss Shrinking Timer Bar */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 3.2, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-[2.5px] bg-[#c8a46a]"
            />
          </motion.div>
        </aside>
      )}
    </AnimatePresence>
  );
}
