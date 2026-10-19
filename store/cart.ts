import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

export const FREE_SHIPPING_THRESHOLD = 500;
export const STANDARD_SHIPPING_COST = 40; // 40 DH Moroccan standard delivery fee

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string, size: string, color: string) => void;
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const quantityToAdd = item.quantity || 1;
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (i) => i.id === item.id && i.size === item.size && i.color === item.color
        );

        if (existingIndex > -1) {
          const updated = [...currentItems];
          updated[existingIndex].quantity += quantityToAdd;
          set({ items: updated });
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: item.id,
                slug: item.slug,
                name: item.name,
                price: item.price,
                image: item.image,
                color: item.color,
                size: item.size,
                quantity: quantityToAdd,
              },
            ],
          });
        }
      },

      removeItem: (id, size, color) => {
        set({
          items: get().items.filter(
            (i) => !(i.id === id && i.size === size && i.color === color)
          ),
        });
      },

      updateQuantity: (id, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, size, color);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShippingFee();
        return subtotal + shipping;
      },
    }),
    {
      name: 'atelier212-cart-storage',
    }
  )
);
