'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/ui';
import { translations } from '@/data/translations';
import { buildSupportWhatsAppUrl } from '@/lib/whatsapp';
import { X, MessageCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOTION_CONFIG } from '@/lib/motion';

export default function MobileMenu() {
  const pathname = usePathname();
  const { isMobileMenuOpen, closeMobileMenu, language } = useUIStore();
  const t = translations[language];

  const links = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.shop, href: '/shop' },
    { label: t.nav.new, href: '/shop?filter=new' },
    { label: t.nav.men, href: '/shop?category=homme' },
    { label: t.nav.women, href: '/shop?category=femme' },
    { label: t.nav.accessories, href: '/shop?category=accessoires' },
    { label: t.nav.contact, href: '/contact' },
  ];

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop with Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />

          {/* Slide-over menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed top-0 bottom-0 left-0 w-4/5 max-w-sm bg-brand-bg z-50 flex flex-col shadow-2xl border-r border-brand-border lg:hidden"
          >
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-brand-border">
              <div>
                <span className="font-heading font-black text-xl tracking-[0.2em] text-brand-text">
                  ATELIER 212
                </span>
                <span className="block text-[8px] uppercase tracking-[0.3em] text-brand-muted">
                  Casablanca
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={closeMobileMenu}
                className="p-2 rounded-brand hover:bg-brand-border/40 text-brand-text transition-colors"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Links list with One-by-One Staggered Entrance */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.06,
                    delayChildren: 0.1,
                  },
                },
              }}
              className="flex-1 overflow-y-auto p-5 space-y-1"
            >
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.35, ease: MOTION_CONFIG.ease },
                      },
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center justify-between px-3 py-3 rounded-brand text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-accent/10 text-brand-accent font-semibold'
                          : 'text-brand-text hover:bg-brand-border/40'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-4 h-4 opacity-40" />
                    </Link>
                  </motion.div>
                );
              })}

              <div className="pt-6 mt-4 border-t border-brand-border">
                <Link
                  href="/policies/livraison-retours"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-xs text-brand-muted hover:text-brand-text transition-colors"
                >
                  {t.footer.shippingInfo}
                </Link>
                <Link
                  href="/policies/guide-des-tailles"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-xs text-brand-muted hover:text-brand-text transition-colors"
                >
                  {t.footer.sizeGuide}
                </Link>
              </div>
            </motion.div>

            {/* Bottom Actions */}
            <div className="p-5 border-t border-brand-border bg-brand-surface/50 space-y-3">
              <motion.a
                whileTap={{ scale: 0.96 }}
                href={buildSupportWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ripple w-full flex items-center justify-center gap-2 py-3 px-4 rounded-brand bg-[#25D366] text-white font-medium text-sm shadow-sm hover:brightness-105 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Service Client WhatsApp</span>
              </motion.a>

              <div className="text-center text-[11px] text-brand-muted">
                Livraison gratuite dès 500 DH partout au Maroc
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
