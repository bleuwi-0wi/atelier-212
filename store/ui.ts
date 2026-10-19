import { create } from 'zustand';
import { Product, Language } from '@/types';

interface FlyingItemData {
  image: string;
  startX: number;
  startY: number;
}

interface UIState {
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  quickViewProduct: Product | null;
  language: Language;
  isDarkMode: boolean;
  toastMessage: string | null;
  isCartBumping: boolean;
  flyingItem: FlyingItemData | null;
  preloaderFinished: boolean;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;

  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;

  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;

  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;

  showToast: (message: string) => void;
  hideToast: () => void;

  triggerCartBump: () => void;
  triggerFlyToCart: (image: string, startX: number, startY: number) => void;
  clearFlyingItem: () => void;
  setPreloaderFinished: (finished: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isCartOpen: false,
  isSearchOpen: false,
  isMobileMenuOpen: false,
  quickViewProduct: null,
  language: 'fr',
  isDarkMode: false,
  toastMessage: null,
  isCartBumping: false,
  flyingItem: null,
  preloaderFinished: false,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  openQuickView: (product: Product) => set({ quickViewProduct: product }),
  closeQuickView: () => set({ quickViewProduct: null }),

  setLanguage: (lang: Language) => {
    set({ language: lang });
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('atelier212-language', lang);
    }
  },

  toggleLanguage: () => {
    const nextLang = get().language === 'fr' ? 'ar' : 'fr';
    get().setLanguage(nextLang);
  },

  toggleDarkMode: () => {
    const nextState = !get().isDarkMode;
    set({ isDarkMode: nextState });
    if (typeof document !== 'undefined') {
      if (nextState) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('atelier212-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('atelier212-theme', 'light');
      }
    }
  },

  setDarkMode: (enabled: boolean) => {
    set({ isDarkMode: enabled });
    if (typeof document !== 'undefined') {
      if (enabled) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },

  showToast: (message: string) => {
    set({ toastMessage: message });
  },

  hideToast: () => set({ toastMessage: null }),

  triggerCartBump: () => {
    set({ isCartBumping: true });
    setTimeout(() => set({ isCartBumping: false }), 450);
  },

  triggerFlyToCart: (image: string, startX: number, startY: number) => {
    set({ flyingItem: { image, startX, startY } });
  },

  clearFlyingItem: () => set({ flyingItem: null }),

  setPreloaderFinished: (finished: boolean) => set({ preloaderFinished: finished }),
}));
