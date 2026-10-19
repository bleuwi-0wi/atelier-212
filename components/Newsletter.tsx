'use client';

import React, { useState } from 'react';
import { useUIStore } from '@/store/ui';
import { translations } from '@/data/translations';
import { Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOTION_CONFIG, sectionRevealVariants } from '@/lib/motion';

export default function Newsletter() {
  const { language } = useUIStore();
  const t = translations[language];

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage(t.newsletter.error);
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 800);
  };

  return (
    <motion.section
      variants={sectionRevealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 sm:py-24 bg-brand-surface border-t border-brand-border"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ duration: 0.25 }}
          className="w-12 h-12 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center mx-auto mb-6 text-brand-accent cursor-pointer"
        >
          <Mail className="w-5 h-5" />
        </motion.div>

        <h2 className="font-heading font-black text-2xl sm:text-4xl text-brand-text mb-3">
          {t.newsletter.title}
        </h2>

        <p className="text-sm text-brand-muted max-w-lg mx-auto mb-8">
          {t.newsletter.subtitle}
        </p>

        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: MOTION_CONFIG.ease }}
            className="p-5 rounded-brand bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 max-w-md mx-auto flex items-center gap-3 text-xs sm:text-sm font-semibold justify-center"
          >
            {/* SVG Check-mark Draw Animation */}
            <svg
              className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.circle
                cx="12"
                cy="12"
                r="10"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
              <motion.path
                d="M8 12l2.8 3 5.2-6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
              />
            </svg>
            <span>{t.newsletter.success}</span>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            animate={
              status === 'error'
                ? { x: [-6, 6, -4, 4, -2, 2, 0], transition: { duration: 0.4 } }
                : { x: 0 }
            }
            className="max-w-md mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder={t.newsletter.placeholder}
                className="flex-1 px-4 py-3 rounded-brand bg-brand-bg border border-brand-border text-brand-text text-sm placeholder-brand-muted focus:outline-none focus:border-brand-accent transition-colors"
                aria-label="Adresse email"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={status === 'loading'}
                className="btn-ripple px-6 py-3 rounded-brand bg-brand-text text-brand-bg text-xs font-semibold uppercase tracking-wider hover:bg-brand-accent hover:text-black transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
              >
                <span>{status === 'loading' ? 'Envoi...' : t.newsletter.submit}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            <AnimatePresence>
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-red-500 mt-2 font-medium justify-center"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </div>
    </motion.section>
  );
}
