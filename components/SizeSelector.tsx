'use client';

import React from 'react';
import Link from 'next/link';
import { translations } from '@/data/translations';
import { useUIStore } from '@/store/ui';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  showSizeGuide?: boolean;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSelectSize,
  showSizeGuide = true,
}: SizeSelectorProps) {
  const { language } = useUIStore();
  const t = translations[language];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-brand-text">
          {t.product.selectSize} : <span className="text-brand-accent font-bold">{selectedSize}</span>
        </label>
        {showSizeGuide && (
          <Link
            href="/policies/guide-des-tailles"
            target="_blank"
            className="text-[11px] text-brand-muted hover:text-brand-accent transition-colors underline"
          >
            {t.product.sizeGuide}
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={`min-w-[46px] h-10 px-3 rounded-brand text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                isSelected
                  ? 'bg-brand-text text-brand-bg border-brand-text shadow-sm scale-105'
                  : 'bg-brand-bg text-brand-text border-brand-border hover:border-brand-accent'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
