'use client';

import React from 'react';
import { buildSupportWhatsAppUrl } from '@/lib/whatsapp';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <aside aria-label="Support WhatsApp" className="fixed bottom-6 right-6 z-40 group">
      {/* Tooltip on hover */}
      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:flex items-center px-3 py-1.5 rounded-brand bg-[#111111] text-white text-[11px] font-medium whitespace-nowrap shadow-lift border border-[#333333] transition-all duration-200">
        Besoin d’aide ? Discutez avec nous sur WhatsApp
      </div>

      {/* Floating Action Button */}
      <a
        href={buildSupportWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 p-3.5 rounded-full bg-[#25D366] text-white shadow-lift flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Contacter le service client sur WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>
    </aside>
  );
}
