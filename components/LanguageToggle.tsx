'use client';

import React from 'react';
import { useUIStore } from '@/store/ui';
import { Globe, Moon, Sun } from 'lucide-react';

export default function LanguageToggle() {
  const { language, toggleLanguage, isDarkMode, toggleDarkMode } = useUIStore();

  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-brand border border-brand-border hover:border-brand-accent transition-colors bg-brand-surface text-brand-text"
        aria-label="Changer de langue"
        title="FR / العربية"
      >
        <Globe className="w-3.5 h-3.5 text-brand-accent" />
        <span className="font-semibold uppercase tracking-wider">{language === 'fr' ? 'AR' : 'FR'}</span>
      </button>

      <button
        onClick={toggleDarkMode}
        className="p-1.5 rounded-brand border border-brand-border hover:border-brand-accent transition-colors bg-brand-surface text-brand-text"
        aria-label="Basculer le mode sombre"
      >
        {isDarkMode ? <Sun className="w-3.5 h-3.5 text-yellow-400" /> : <Moon className="w-3.5 h-3.5 text-brand-muted" />}
      </button>
    </div>
  );
}
