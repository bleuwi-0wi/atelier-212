'use client';

import React from 'react';
import Link from 'next/link';
import { useUIStore } from '@/store/ui';
import { translations } from '@/data/translations';
import { buildSupportWhatsAppUrl } from '@/lib/whatsapp';
import { Instagram, Facebook, MessageCircle, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { language } = useUIStore();
  const t = translations[language];

  return (
    <footer className="bg-[#111111] text-[#faf8f5] border-t border-[#262626] pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#262626]">
          {/* Column 1: Brand & About (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-heading font-black text-2xl tracking-[0.2em] text-[#faf8f5]">
                ATELIER 212
              </span>
              <span className="block text-[9px] uppercase tracking-[0.35em] text-[#c8a46a] font-medium">
                Maison Marocaine de Prêt-à-Porter
              </span>
            </Link>

            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              {t.footer.aboutText}
            </p>

            <div className="space-y-1.5 text-neutral-400 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#c8a46a]" />
                <span>Gauthier / Boulevard d’Anfa, Casablanca, Maroc</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#c8a46a]" />
                <span>+212 6 12 34 56 78</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#c8a46a]" />
                <span>contact@atelier212.ma</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#c8a46a] hover:text-black flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#c8a46a] hover:text-black flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={buildSupportWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-[#faf8f5] uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <Link href="/" className="hover:text-[#c8a46a] transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#c8a46a] transition-colors">
                  {t.nav.shop}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=homme" className="hover:text-[#c8a46a] transition-colors">
                  {t.nav.men}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=femme" className="hover:text-[#c8a46a] transition-colors">
                  {t.nav.women}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=accessoires" className="hover:text-[#c8a46a] transition-colors">
                  {t.nav.accessories}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-[#faf8f5] uppercase tracking-wider">
              {t.footer.customerCare}
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <Link href="/policies/livraison-retours" className="hover:text-[#c8a46a] transition-colors">
                  {t.footer.shippingInfo}
                </Link>
              </li>
              <li>
                <Link href="/policies/guide-des-tailles" className="hover:text-[#c8a46a] transition-colors">
                  {t.footer.sizeGuide}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#c8a46a] transition-colors">
                  {t.footer.contactUs}
                </Link>
              </li>
              <li>
                <a
                  href={buildSupportWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#c8a46a] transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3 h-3 text-[#25D366]" />
                  <span>Assistance WhatsApp 7j/7</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal Policies */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-[#faf8f5] uppercase tracking-wider">
              {t.footer.policies}
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <Link href="/policies/confidentialite" className="hover:text-[#c8a46a] transition-colors">
                  {t.footer.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link href="/policies/conditions-generales" className="hover:text-[#c8a46a] transition-colors">
                  {t.footer.termsOfService}
                </Link>
              </li>
              <li>
                <Link href="/policies/livraison-retours" className="hover:text-[#c8a46a] transition-colors">
                  {t.footer.refundPolicy}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Payment badges & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-neutral-400 text-xs">
          <div>
            &copy; {new Date().getFullYear()} ATELIER 212. {t.footer.rights}
          </div>

          {/* Payment Badges (Cash on delivery, Visa, Mastercard, CMI) */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[11px] text-neutral-400 mr-2">{t.footer.paymentMethods}</span>

            {/* COD Badge */}
            <span className="px-2.5 py-1 rounded bg-[#1e1e1e] border border-[#333333] text-[10px] font-bold text-[#faf8f5] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-green-400" />
              <span>Cash on Delivery</span>
            </span>

            {/* Visa Badge */}
            <span className="px-2.5 py-1 rounded bg-[#1e1e1e] border border-[#333333] text-[10px] font-black text-blue-400 tracking-wider">
              VISA
            </span>

            {/* Mastercard Badge */}
            <span className="px-2.5 py-1 rounded bg-[#1e1e1e] border border-[#333333] text-[10px] font-black text-orange-400 tracking-wider">
              MASTERCARD
            </span>

            {/* Moroccan CMI */}
            <span className="px-2.5 py-1 rounded bg-[#1e1e1e] border border-[#333333] text-[10px] font-bold text-neutral-300">
              CMI Maroc
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
