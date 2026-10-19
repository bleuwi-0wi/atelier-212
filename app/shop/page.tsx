'use client';

import React, { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '@/data/products';
import FilterBar from '@/components/FilterBar';
import ProductGrid from '@/components/ProductGrid';
import { ShoppingBag } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();

  const category = searchParams.get('category') || 'all';
  const size = searchParams.get('size') || '';
  const color = searchParams.get('color') || '';
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null;
  const sort = searchParams.get('sort') || 'newest';
  const filter = searchParams.get('filter') || '';

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by new drops if filter=new
    if (filter === 'new') {
      result = result.filter((p) => p.isNew);
    }

    // Filter by category
    if (category !== 'all') {
      if (category === 'hoodies') {
        result = result.filter((p) => p.name.toLowerCase().includes('hoodie') || p.name.toLowerCase().includes('sweat'));
      } else if (category === 'cargos') {
        result = result.filter((p) => p.name.toLowerCase().includes('cargo') || p.name.toLowerCase().includes('pantalon'));
      } else {
        result = result.filter((p) => p.category === category);
      }
    }

    // Filter by size
    if (size) {
      result = result.filter((p) => p.sizes.includes(size));
    }

    // Filter by color
    if (color) {
      result = result.filter((p) => p.colors.includes(color));
    }

    // Filter by price
    if (maxPrice && !isNaN(maxPrice)) {
      result = result.filter((p) => p.price <= maxPrice);
    }

    // Sort
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // newest first
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [category, size, color, maxPrice, sort, filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Page Header */}
      <div className="mb-8 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
          Catalogue Complet
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-brand-text mt-1">
          La Boutique Atelier 212
        </h1>
        <p className="text-sm text-brand-muted mt-2 max-w-xl">
          Toutes nos pièces streetwear confectionnées avec rigueur au Maroc. Paiement à la livraison partout au Royaume.
        </p>
      </div>

      {/* Dynamic Filter Bar */}
      <FilterBar totalResults={filteredProducts.length} />

      {/* Product Results */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center bg-brand-surface rounded-brand border border-brand-border">
          <ShoppingBag className="w-12 h-12 text-brand-muted mx-auto mb-4 opacity-40" />
          <h3 className="font-heading font-bold text-xl text-brand-text mb-2">
            Aucun article ne correspond à vos filtres
          </h3>
          <p className="text-xs text-brand-muted max-w-sm mx-auto mb-6">
            Essayez d’élargir votre recherche ou de réinitialiser les filtres pour voir l’ensemble de nos modèles.
          </p>
          <a
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-brand bg-brand-text text-brand-bg text-xs font-semibold uppercase tracking-wider hover:bg-brand-accent transition-colors"
          >
            Réinitialiser les filtres
          </a>
        </div>
      ) : (
        <ProductGrid products={filteredProducts} />
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-brand-muted">
          Chargement de la boutique...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
