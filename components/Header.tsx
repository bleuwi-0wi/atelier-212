'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/ui';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { translations } from '@/data/translations';
import LanguageToggle from './LanguageToggle';
import { Search, ShoppingBag, Heart, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOTION_CONFIG } from '@/lib/motion';

export default function Header() {
  const pathname = usePathname();
  const { language, openCart, openSearch, openMobileMenu, isCartBumping, preloaderFinished } = useUIStore();
  const { getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const t = translations[language];

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if scrolled past threshold for shrink/blur
      setScrolled(currentScrollY > 20);

      // Smart hide on fast scroll down (> 120px), show on scroll up
      if (currentScrollY > 120 && currentScrollY > lastScrollY.current + 8) {
        setShowHeader(false); // scrolling down fast
      } else if (currentScrollY < lastScrollY.current - 4 || currentScrollY <= 80) {
        setShowHeader(true); // scrolling up
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = mounted ? getItemCount() : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  const navLinks = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.shop, href: '/shop' },
    { label: t.nav.men, href: '/shop?category=homme' },
    { label: t.nav.women, href: '/shop?category=femme' },
    { label: t.nav.accessories, href: '/shop?category=accessoires' },
    { label: t.nav.contact, href: '/contact' },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{
        y: showHeader ? 0 : -90,
        opacity: showHeader ? 1 : 0,
      }}
      transition={{
        duration: 0.35,
        ease: MOTION_CONFIG.ease,
      }}
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-brand-bg/95 backdrop-blur-md shadow-soft border-b border-brand-border/80 py-2.5 sm:py-3'
          : 'bg-brand-bg/80 backdrop-blur-sm border-b border-brand-border/40 py-3.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={openMobileMenu}
              className="p-2 -ml-2 rounded-brand text-brand-text hover:bg-brand-border/50 transition-colors"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link href="/" className="inline-block group">
              <span className="font-heading font-black text-xl sm:text-2xl tracking-[0.2em] text-brand-text group-hover:text-brand-accent transition-colors">
                ATELIER 212
              </span>
              <span className="block text-[9px] uppercase tracking-[0.35em] text-brand-muted -mt-1 font-medium">
                Maison Marocaine
              </span>
            </Link>
          </div>

          {/* Desktop Navigation with Animated Underline */}
          <nav className="hidden lg:flex items-center space-x-7 rtl:space-x-reverse text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative py-1 transition-colors hover:text-brand-accent ${
                    isActive ? 'text-brand-accent font-semibold' : 'text-brand-text/90'
                  }`}
                >
                  <span>{link.label}</span>
                  {/* Underline expanding from left to right */}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-brand-accent rounded-full transition-all duration-300 ease-out ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
            <LanguageToggle />

            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={openSearch}
              className="p-2 rounded-brand text-brand-text hover:text-brand-accent hover:bg-brand-border/40 transition-colors"
              aria-label="Rechercher"
              title="Rechercher (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Wishlist */}
            <Link
              href="/shop"
              className="p-2 rounded-brand text-brand-text hover:text-brand-accent hover:bg-brand-border/40 transition-colors relative hidden sm:flex items-center justify-center"
              aria-label="Favoris"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Heart className="w-5 h-5" />
              </motion.div>
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Cart Button with Bounce & Badge Pop */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              animate={
                isCartBumping
                  ? {
                      scale: [1, 1.25, 0.92, 1.1, 1],
                      rotate: [0, -8, 8, -4, 0],
                      transition: { duration: 0.45, ease: MOTION_CONFIG.easeElastic },
                    }
                  : { scale: 1 }
              }
              onClick={openCart}
              className="p-2 rounded-brand text-brand-text hover:text-brand-accent hover:bg-brand-border/40 transition-colors relative flex items-center justify-center"
              aria-label="Panier d'achats"
            >
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.3, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="absolute -top-1 -right-1 bg-brand-text text-brand-bg text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
