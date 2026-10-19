import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileMenu from '@/components/MobileMenu';
import SearchOverlay from '@/components/SearchOverlay';
import CartDrawer from '@/components/CartDrawer';
import QuickViewModal from '@/components/QuickViewModal';
import WhatsAppButton from '@/components/WhatsAppButton';
import Toast from '@/components/Toast';
import Preloader from '@/components/Preloader';
import ScrollProgress from '@/components/ScrollProgress';
import BackToTop from '@/components/BackToTop';
import CustomCursor from '@/components/CustomCursor';
import SmoothScroll from '@/components/SmoothScroll';
import FlyToCart from '@/components/FlyToCart';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#111111',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://atelier212.ma'),
  title: {
    default: 'ATELIER 212 — Streetwear Moderne & Prêt-à-Porter Marocain',
    template: '%s | ATELIER 212',
  },
  description:
    'Maison de prêt-à-porter streetwear haut de gamme à Casablanca. Molleton lourd 480 GSM, coupes boxy et livraison express avec paiement à la livraison partout au Maroc.',
  keywords: [
    'streetwear maroc',
    'hoodie oversized casablanca',
    'mode marocaine',
    'atelier 212',
    'vêtements homme maroc',
    'vêtements femme maroc',
    'livraison rapide maroc',
    'paiement a la livraison maroc',
  ],
  authors: [{ name: 'ATELIER 212' }],
  creator: 'ATELIER 212',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://atelier212.ma',
    title: 'ATELIER 212 — Streetwear Moderne au Maroc',
    description:
      'Streetwear minimaliste et haut de gamme. Paiement en espèces à la livraison partout au Maroc.',
    siteName: 'ATELIER 212',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'ATELIER 212 Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATELIER 212 — Streetwear Maroc',
    description: 'Paiement à la livraison et retours faciles sous 7 jours au Maroc.',
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" dir="ltr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased selection:bg-brand-accent selection:text-black">
        <SmoothScroll>
          {/* Page Load Intro & Progress Line */}
          <Preloader />
          <ScrollProgress />
          <CustomCursor />
          <FlyToCart />

          <AnnouncementBar />
          <Header />

          <main className="flex-1 w-full">{children}</main>

          <Footer />

          {/* Interactive Drawers, Modals & Floating Buttons */}
          <MobileMenu />
          <SearchOverlay />
          <CartDrawer />
          <QuickViewModal />
          <WhatsAppButton />
          <BackToTop />
          <Toast />
        </SmoothScroll>
      </body>
    </html>
  );
}
