'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FilterState } from '@/types';
import { translations } from '@/data/translations';
import { useUIStore } from '@/store/ui';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  totalResults: number;
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Taille Unique'];
const AVAILABLE_COLORS = [
  { name: 'Noir', hex: '#111111' },
  { name: 'Sable / Or', hex: '#c8a46a' },
  { name: 'Gris Muted', hex: '#6b6b6b' },
  { name: 'Blanc Ivoire', hex: '#faf8f5' },
  { name: 'Olive Militaire', hex: '#2e332c' },
];

export default function FilterBar({ totalResults }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language } = useUIStore();

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Active query parameters
  const currentCategory = searchParams.get('category') || 'all';
  const currentSize = searchParams.get('size') || '';
  const currentColor = searchParams.get('color') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters = Boolean(
    (currentCategory && currentCategory !== 'all') ||
      currentSize ||
      currentColor ||
      currentMinPrice ||
      currentMaxPrice ||
      currentSort !== 'newest'
  );

  return (
    <div className="w-full mb-8 bg-brand-surface rounded-brand border border-brand-border p-4 shadow-soft">
      {/* Top summary row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Total counts & Mobile button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="md:hidden flex items-center gap-2 px-3 py-2 rounded-brand border border-brand-border text-xs font-semibold uppercase tracking-wider text-brand-text bg-brand-bg"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtres</span>
          </button>

          <span className="text-xs font-medium text-brand-muted">
            <strong className="text-brand-text font-bold">{totalResults}</strong> articles trouvés
          </span>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="hidden sm:inline-flex items-center gap-1 text-xs text-brand-accent hover:underline font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>

        {/* Right: Sort selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs font-medium text-brand-muted hidden sm:inline">
            Trier par :
          </label>
          <select
            id="sort-select"
            value={currentSort}
            onChange={(e) => updateFilters('sort', e.target.value)}
            className="text-xs font-medium bg-brand-bg border border-brand-border rounded-brand px-3 py-2 text-brand-text focus:outline-none focus:border-brand-accent"
          >
            <option value="newest">Nouveautés d’abord</option>
            <option value="price-asc">Prix : croissant</option>
            <option value="price-desc">Prix : décroissant</option>
          </select>
        </div>
      </div>

      {/* Filter Options (Desktop always visible, Mobile collapsible) */}
      <div
        className={`mt-4 pt-4 border-t border-brand-border md:grid md:grid-cols-4 gap-6 ${
          isMobileFiltersOpen ? 'block space-y-4 md:space-y-0' : 'hidden md:grid'
        }`}
      >
        {/* Category Filter */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-2">
            Catégorie
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Tous', value: 'all' },
              { label: 'Homme', value: 'homme' },
              { label: 'Femme', value: 'femme' },
              { label: 'Accessoires', value: 'accessoires' },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => updateFilters('category', cat.value)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  currentCategory === cat.value
                    ? 'bg-brand-text text-brand-bg font-semibold'
                    : 'bg-brand-bg text-brand-muted hover:text-brand-text border border-brand-border'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Size Filter */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-2">
            Taille
          </label>
          <div className="flex flex-wrap gap-1.5">
            {AVAILABLE_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => updateFilters('size', currentSize === size ? '' : size)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  currentSize === size
                    ? 'bg-brand-text text-brand-bg font-semibold'
                    : 'bg-brand-bg text-brand-muted hover:text-brand-text border border-brand-border'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Filter */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-2">
            Couleur
          </label>
          <div className="flex items-center gap-2">
            {AVAILABLE_COLORS.map((col) => {
              const isSelected = currentColor === col.hex;
              return (
                <button
                  key={col.hex}
                  onClick={() => updateFilters('color', isSelected ? '' : col.hex)}
                  title={col.name}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    isSelected
                      ? 'border-brand-accent ring-2 ring-brand-accent scale-110'
                      : 'border-brand-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: col.hex }}
                />
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-2">
            Budget max (DH)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Ex: 800"
              value={currentMaxPrice}
              onChange={(e) => updateFilters('maxPrice', e.target.value)}
              className="w-full bg-brand-bg border border-brand-border rounded px-2.5 py-1 text-xs text-brand-text focus:outline-none focus:border-brand-accent"
            />
            {currentMaxPrice && (
              <button
                onClick={() => updateFilters('maxPrice', '')}
                className="text-brand-muted hover:text-brand-text p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
