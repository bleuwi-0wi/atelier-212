'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/ui';
import { products } from '@/data/products';
import { translations } from '@/data/translations';
import { formatPrice } from '@/lib/format';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalVariants } from '@/lib/motion';

export default function SearchOverlay() {
  const router = useRouter();
  const { isSearchOpen, closeSearch, language } = useUIStore();
  const t = translations[language];

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = query.trim() === ''
    ? []
    : products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      });

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSearchOpen) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          useUIStore.getState().openSearch();
        }
        return;
      }

      if (e.key === 'Escape') {
        closeSearch();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredProducts.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredProducts.length - 1
        );
      } else if (e.key === 'Enter' && filteredProducts[selectedIndex]) {
        e.preventDefault();
        router.push(`/product/${filteredProducts[selectedIndex].slug}`);
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, filteredProducts, selectedIndex, closeSearch, router]);

  const quickTerms = ['Hoodie', 'Cargo', 'Blazer', 'Casquette', 'Sweat'];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-12">
          {/* Backdrop with Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Content with Fade + Scale from 0.96 */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl bg-brand-surface rounded-brand shadow-modal border border-brand-border overflow-hidden z-10 flex flex-col max-h-[85vh]"
          >
            {/* Input Header */}
            <div className="p-4 sm:p-5 border-b border-brand-border flex items-center gap-3">
              <Search className="w-5 h-5 text-brand-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={t.search.placeholder}
                className="w-full bg-transparent text-base sm:text-lg text-brand-text placeholder-brand-muted focus:outline-none"
              />
              {query && (
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setQuery('')}
                  className="p-1 rounded hover:bg-brand-border/40 text-brand-muted"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
              <button
                onClick={closeSearch}
                className="text-xs uppercase tracking-wider font-semibold text-brand-muted hover:text-brand-text px-2 py-1 border border-brand-border rounded"
              >
                Échap
              </button>
            </div>

            {/* Quick Suggestions when empty */}
            {query.trim() === '' && (
              <div className="p-6 text-sm">
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-3">
                  {t.search.quickLinks}
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickTerms.map((term) => (
                    <motion.button
                      key={term}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQuery(term)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-brand-bg hover:bg-brand-border/50 border border-brand-border text-brand-text transition-colors"
                    >
                      <Tag className="w-3 h-3 text-brand-accent" />
                      <span>{term}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Results List */}
            {query.trim() !== '' && (
              <div className="flex-1 overflow-y-auto p-4 divide-y divide-brand-border/40">
                {filteredProducts.length === 0 ? (
                  <div className="py-12 text-center text-brand-muted">
                    <p className="text-sm">
                      {t.search.noResults} <span className="font-semibold text-brand-text">&quot;{query}&quot;</span>
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="pb-2 text-xs text-brand-muted font-medium">
                      {t.search.resultsCount.replace('{count}', filteredProducts.length.toString())}
                    </div>
                    {filteredProducts.map((product, idx) => {
                      const isSelected = idx === selectedIndex;
                      return (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={closeSearch}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`flex items-center gap-4 py-3 px-3 rounded-brand transition-colors ${
                            isSelected ? 'bg-brand-bg shadow-sm' : 'hover:bg-brand-bg/50'
                          }`}
                        >
                          <div className="relative w-14 h-16 rounded-brand overflow-hidden shrink-0 bg-brand-border/30">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-brand-text truncate">
                              {product.name}
                            </h4>
                            <p className="text-xs text-brand-muted capitalize">
                              {product.category}
                            </p>
                            <p className="text-xs font-bold text-brand-accent mt-0.5">
                              {formatPrice(product.price)}
                            </p>
                          </div>

                          <ArrowRight
                            className={`w-4 h-4 shrink-0 transition-transform ${
                              isSelected ? 'text-brand-accent translate-x-1' : 'text-brand-muted opacity-40'
                            }`}
                          />
                        </Link>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
