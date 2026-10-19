import React from 'react';
import Hero from '@/components/Hero';
import CategoryGrid from '@/components/CategoryGrid';
import ProductGrid from '@/components/ProductGrid';
import PromoBanner from '@/components/PromoBanner';
import TrustBadges from '@/components/TrustBadges';
import Reviews from '@/components/Reviews';
import SocialGallery from '@/components/SocialGallery';
import Newsletter from '@/components/Newsletter';
import { products } from '@/data/products';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  // 8 featured items as requested
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="w-full">
      {/* 3. Hero Section */}
      <Hero />

      {/* 4. Category Grid (5 tiles) */}
      <CategoryGrid />

      {/* 5. Featured Products Grid (8 items) */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
              Sélection Atelier
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-brand-text mt-1">
              Pièces Signature
            </h2>
            <p className="text-sm text-brand-muted mt-2">
              Les créations les plus plébiscitées par notre communauté marocaine.
            </p>
          </div>
          <Link
            href="/shop"
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-text hover:text-brand-accent transition-colors"
          >
            <span>Voir toute la boutique</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      {/* 6. Promo Banner (-20% with live countdown) */}
      <PromoBanner />

      {/* 7. Trust Badges (Livraison rapide, COD, Retours 7j, WhatsApp) */}
      <TrustBadges />

      {/* 8. Reviews Slider (5 Moroccan customer testimonials) */}
      <Reviews />

      {/* 9. Social Gallery (Instagram / TikTok streetwear lookbook) */}
      <SocialGallery />

      {/* 10. Newsletter Signup (with validation and success alert) */}
      <Newsletter />
    </div>
  );
}
