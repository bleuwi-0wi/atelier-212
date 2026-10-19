import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Truck, Ruler, Shield, FileText } from 'lucide-react';

interface PolicyPageProps {
  params: {
    slug: string;
  };
}

const POLICIES: Record<
  string,
  {
    title: string;
    subtitle: string;
    icon: any;
    content: React.ReactNode;
  }
> = {
  'livraison-retours': {
    title: 'Livraison & Échanges au Maroc',
    subtitle: 'Modalités d’expédition, délais et politique d’échange sous 7 jours',
    icon: Truck,
    content: (
      <div className="space-y-6 text-sm text-brand-muted leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-heading font-bold text-lg text-brand-text">1. Délais et Villes Desservies</h2>
          <p>
            Toutes nos commandes sont expédiées depuis notre atelier central situé à <strong>Casablanca</strong>. Nous collaborons avec des partenaires logistiques leaders au Royaume (CTM Messagerie, Amana, Cathedis) :
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Casablanca & environs immédiats (Mohammedia, Bouskoura, Dar Bouazza) :</strong> Livraison garantie sous 24 heures ouvrées.</li>
            <li><strong>Rabat, Salé, Marrakech, Tanger, Fès, Meknès, Kénitra :</strong> Livraison sous 24 à 48 heures.</li>
            <li><strong>Agadir, Oujda, Tétouan, Nador et provinces du Sud :</strong> Livraison sous 48 à 72 heures.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-lg text-brand-text">2. Frais d’Expédition</h2>
          <p>
            • <strong>Livraison GRATUITE</strong> dès <strong>500 DH</strong> d’achats sur l’ensemble du panier.<br />
            • Pour les commandes inférieures à 500 DH, un tarif forfaitaire unique de <strong>40 DH</strong> est appliqué.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-lg text-brand-text">3. Mode de Paiement (Cash on Delivery)</h2>
          <p>
            Vous ne payez rien en ligne ! Le paiement s’effectue en espèces directement auprès du livreur lors de la remise en main propre de votre colis. Vous pouvez vérifier l’intégrité du paquet à la livraison.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-lg text-brand-text">4. Échanges de Taille sous 7 Jours</h2>
          <p>
            Si la taille ne vous convient pas, nous effectuons un échange sous 7 jours calendaires. Il vous suffit d’envoyer un message à notre support WhatsApp au <strong>+212 6 12 34 56 78</strong>. Un livreur passera vous remettre la nouvelle taille et reprendre l’article précédent. L’article doit être dans son état neuf avec ses étiquettes d’origine.
          </p>
        </section>
      </div>
    ),
  },

  'guide-des-tailles': {
    title: 'Guide des Tailles Streetwear',
    subtitle: 'Mesures exactes en centimètres pour trouver votre coupe parfaite',
    icon: Ruler,
    content: (
      <div className="space-y-8 text-sm text-brand-muted leading-relaxed">
        <p>
          Toutes nos pièces ATELIER 212 adoptent une <strong>coupe boxy moderne</strong> inspirée du streetwear japonais et californien. Elles sont naturellement décontractées.
        </p>

        <div>
          <h2 className="font-heading font-bold text-base text-brand-text mb-3">Hoodies & Sweatshirts Oversized (cm)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-brand-border">
              <thead className="bg-brand-bg text-brand-text">
                <tr className="border-b border-brand-border">
                  <th className="p-3">Taille</th>
                  <th className="p-3">Tour de Poitrine</th>
                  <th className="p-3">Largeur Épaule</th>
                  <th className="p-3">Longueur Corps</th>
                  <th className="p-3">Longueur Manche</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                <tr><td className="p-3 font-bold text-brand-text">S</td><td className="p-3">112 cm</td><td className="p-3">54 cm</td><td className="p-3">68 cm</td><td className="p-3">60 cm</td></tr>
                <tr><td className="p-3 font-bold text-brand-text">M</td><td className="p-3">118 cm</td><td className="p-3">56 cm</td><td className="p-3">71 cm</td><td className="p-3">62 cm</td></tr>
                <tr><td className="p-3 font-bold text-brand-text">L</td><td className="p-3">124 cm</td><td className="p-3">58 cm</td><td className="p-3">74 cm</td><td className="p-3">64 cm</td></tr>
                <tr><td className="p-3 font-bold text-brand-text">XL</td><td className="p-3">130 cm</td><td className="p-3">60 cm</td><td className="p-3">77 cm</td><td className="p-3">66 cm</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="font-heading font-bold text-base text-brand-text mb-3">T-Shirts Boxy Cut (cm)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-brand-border">
              <thead className="bg-brand-bg text-brand-text">
                <tr className="border-b border-brand-border">
                  <th className="p-3">Taille</th>
                  <th className="p-3">Largeur Poitrine</th>
                  <th className="p-3">Longueur Totale</th>
                  <th className="p-3">Recommandation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                <tr><td className="p-3 font-bold text-brand-text">S</td><td className="p-3">56 cm</td><td className="p-3">70 cm</td><td className="p-3">1m65 — 1m75 (Moins de 70kg)</td></tr>
                <tr><td className="p-3 font-bold text-brand-text">M</td><td className="p-3">59 cm</td><td className="p-3">73 cm</td><td className="p-3">1m72 — 1m82 (70 - 82kg)</td></tr>
                <tr><td className="p-3 font-bold text-brand-text">L</td><td className="p-3">62 cm</td><td className="p-3">76 cm</td><td className="p-3">1m80 — 1m90 (80 - 92kg)</td></tr>
                <tr><td className="p-3 font-bold text-brand-text">XL</td><td className="p-3">65 cm</td><td className="p-3">79 cm</td><td className="p-3">1m85+ (Plus de 90kg)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
  },

  confidentialite: {
    title: 'Politique de Confidentialité',
    subtitle: 'Protection des données de nos clients conformément aux lois marocaines (CNDP)',
    icon: Shield,
    content: (
      <div className="space-y-4 text-sm text-brand-muted leading-relaxed">
        <p>
          Chez ATELIER 212, la confidentialité de vos informations personnelles est primordiale. Les données recueillies lors du processus de commande (Nom, Téléphone, Adresse de livraison) sont exclusivement destinées au traitement logistique et à l’acheminement de vos colis par nos livreurs partenaires.
        </p>
        <p>
          Vos numéros de téléphone et coordonnées ne sont jamais vendus, cédés ou transmis à des tiers publicitaires. Conformément à la loi n° 09-08 relative à la protection des personnes physiques à l’égard du traitement des données à caractère personnel au Maroc, vous disposez d’un droit d’accès et de rectification sur simple demande par email à <strong>contact@atelier212.ma</strong>.
        </p>
      </div>
    ),
  },

  'conditions-generales': {
    title: 'Conditions Générales de Vente',
    subtitle: 'Règles et conditions d’utilisation de la plateforme de vente en ligne',
    icon: FileText,
    content: (
      <div className="space-y-4 text-sm text-brand-muted leading-relaxed">
        <p>
          Les présentes conditions générales régissent l’ensemble des ventes réalisées sur le site officiel ATELIER 212 au Maroc.
        </p>
        <p>
          <strong>Validation de commande :</strong> Toute commande passée via notre formulaire en ligne ou confirmée sur WhatsApp engage le client à réceptionner le colis et à s’acquitter du montant convenu auprès du livreur.
        </p>
        <p>
          <strong>Prix :</strong> Tous les tarifs indiqués sont en Dirhams Marocains (MAD / DH) et s’entendent toutes taxes comprises (TTC). Les frais de livraison sont offerts dès 500 DH.
        </p>
      </div>
    ),
  },
};

export async function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PolicyPageProps): Promise<Metadata> {
  const policy = POLICIES[params.slug];
  if (!policy) {
    return { title: 'Page introuvable | ATELIER 212' };
  }
  return {
    title: `${policy.title} | ATELIER 212`,
    description: policy.subtitle,
  };
}

export default function PolicyPage({ params }: PolicyPageProps) {
  const policy = POLICIES[params.slug];

  if (!policy) {
    notFound();
  }

  const Icon = policy.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-text transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à l’accueil</span>
        </Link>
      </div>

      <div className="bg-brand-surface rounded-brand border border-brand-border p-6 sm:p-10 shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center text-brand-accent border border-brand-border">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-brand-text">
              {policy.title}
            </h1>
            <p className="text-xs text-brand-muted mt-0.5">
              {policy.subtitle}
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-brand-border">
          {policy.content}
        </div>
      </div>
    </div>
  );
}
