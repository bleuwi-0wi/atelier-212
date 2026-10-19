import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 sm:py-32 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center mx-auto mb-6 text-brand-accent">
        <Compass className="w-8 h-8" />
      </div>

      <span className="font-mono text-xs uppercase tracking-widest text-brand-accent font-bold">
        Erreur 404
      </span>

      <h1 className="font-heading font-black text-3xl sm:text-5xl text-brand-text mt-2 mb-4">
        Page Introuvable
      </h1>

      <p className="text-sm text-brand-muted max-w-md mx-auto mb-8 leading-relaxed">
        La pièce ou l’adresse que vous recherchez semble introuvable ou a été archivée dans les collections passées.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-brand bg-brand-text text-brand-bg text-xs font-semibold uppercase tracking-wider hover:bg-brand-accent hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l’accueil</span>
        </Link>

        <Link
          href="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-brand border border-brand-border bg-brand-surface text-brand-text text-xs font-semibold uppercase tracking-wider hover:border-brand-accent transition-colors"
        >
          <span>Découvrir la boutique</span>
        </Link>
      </div>
    </div>
  );
}
