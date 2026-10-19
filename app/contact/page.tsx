'use client';

import React, { useState } from 'react';
import { buildSupportWhatsAppUrl } from '@/lib/whatsapp';
import { useUIStore } from '@/store/ui';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const { showToast } = useUIStore();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Votre message a été transmis à notre équipe !');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
          Service Client & Studio
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-brand-text mt-1">
          Contactez l’Atelier
        </h1>
        <p className="text-sm text-brand-muted mt-3">
          Une question sur une taille, un suivi d’expédition au Maroc ou une demande spéciale ? Notre équipe vous répond sous 2 heures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info & WhatsApp (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick WhatsApp Banner */}
          <div className="p-6 rounded-brand bg-[#25D366]/10 border border-[#25D366]/30 space-y-3">
            <div className="flex items-center gap-2 text-[#25D366] font-bold text-sm">
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Réponse Immédiate par WhatsApp</span>
            </div>
            <p className="text-xs text-brand-text/80 leading-relaxed">
              Pour une prise en charge prioritaire de votre commande ou une aide rapide sur le choix de votre coupe :
            </p>
            <a
              href={buildSupportWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-brand bg-[#25D366] text-white font-semibold text-xs uppercase tracking-wider hover:brightness-105 transition-all shadow-sm"
            >
              <span>Discuter sur WhatsApp</span>
            </a>
          </div>

          {/* Details Card */}
          <div className="bg-brand-surface rounded-brand border border-brand-border p-6 shadow-soft space-y-5 text-xs">
            <h3 className="font-heading font-bold text-base text-brand-text border-b border-brand-border pb-3">
              Informations Pratiques
            </h3>

            <div className="flex items-start gap-3 text-brand-muted">
              <MapPin className="w-4 h-4 text-brand-accent mt-0.5 shrink-0" />
              <div>
                <strong className="text-brand-text block">Atelier & Showroom :</strong>
                <span>42 Rue Jules Ferry, Quartier Gauthier, Casablanca, Maroc</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-brand-muted">
              <Phone className="w-4 h-4 text-brand-accent mt-0.5 shrink-0" />
              <div>
                <strong className="text-brand-text block">Téléphone & WhatsApp :</strong>
                <span>+212 6 12 34 56 78</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-brand-muted">
              <Mail className="w-4 h-4 text-brand-accent mt-0.5 shrink-0" />
              <div>
                <strong className="text-brand-text block">Email :</strong>
                <span>contact@atelier212.ma</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-brand-muted">
              <Clock className="w-4 h-4 text-brand-accent mt-0.5 shrink-0" />
              <div>
                <strong className="text-brand-text block">Horaires du Service Client :</strong>
                <span>Lundi au Samedi : 09h30 — 20h00</span>
                <span className="block text-[11px] text-brand-accent">Dimanche : Permanence WhatsApp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-brand-surface rounded-brand border border-brand-border p-6 sm:p-8 shadow-soft">
            <h2 className="font-heading font-bold text-lg text-brand-text mb-6">
              Envoyez-nous un Message
            </h2>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-brand bg-green-500/10 border border-green-500/30 text-center space-y-3"
              >
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400 mx-auto" />
                <h3 className="font-heading font-bold text-lg text-brand-text">
                  Message Envoyé avec Succès !
                </h3>
                <p className="text-xs text-brand-muted max-w-sm mx-auto">
                  Merci de nous avoir contactés. Notre conseiller clientèle à Casablanca reviendra vers vous très rapidement.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2 rounded-brand bg-brand-text text-brand-bg text-xs font-semibold uppercase tracking-wider"
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Votre nom"
                      className="w-full px-4 py-2.5 rounded-brand bg-brand-bg border border-brand-border text-xs sm:text-sm text-brand-text focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="06..."
                      className="w-full px-4 py-2.5 rounded-brand bg-brand-bg border border-brand-border text-xs sm:text-sm text-brand-text focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                    Adresse email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="votre.email@exemple.com"
                    className="w-full px-4 py-2.5 rounded-brand bg-brand-bg border border-brand-border text-xs sm:text-sm text-brand-text focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                    Objet de votre demande
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Suivi de commande, question taille..."
                    className="w-full px-4 py-2.5 rounded-brand bg-brand-bg border border-brand-border text-xs sm:text-sm text-brand-text focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                    Votre message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Comment pouvons-nous vous aider ?"
                    className="w-full px-4 py-2.5 rounded-brand bg-brand-bg border border-brand-border text-xs sm:text-sm text-brand-text focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30 transition-all"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="btn-ripple w-full py-3.5 px-6 rounded-brand bg-brand-text text-brand-bg text-xs font-semibold uppercase tracking-[0.15em] hover:bg-brand-accent hover:text-black transition-colors flex items-center justify-center gap-2 shadow-lift"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer ma demande</span>
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
