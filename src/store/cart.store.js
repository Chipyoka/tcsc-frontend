import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';

const useCartStore = create(
  persist(
    (set, get) => ({
      // --- CART STATE ---
      items: [], // Each = { id, name, price, quantity, image, sku, category, ... }
      isOpen: false,

      // --- SUBSCRIPTION STATE ---
      subscriptions: [], // Each = { id, name, price, frequency, image, sku, stripePriceId, ... }

      // --- COMPUTED GETTERS ---
      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getTotalSubscriptions: () => get().subscriptions.length,
      getSubscriptionSubtotal: () =>
        get().subscriptions.reduce((sum, s) => sum + s.price, 0),

      // --- CART ACTIONS ---
      addItem: (product) => {
        const items = get().items;
        const existing = items.find((i) => i.id === product.id);

        let updated;
        if (existing) {
          updated = items.map((i) =>
            i.id === product.id
              ? { ...i, quantity: i.quantity + (product.quantity || 1) }
              : i
          );
        } else {
          updated = [...items, { ...product, quantity: product.quantity || 1 }];
        }

        set({ items: updated });
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.id !== id) });
        } else {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          });
        }
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),

      // --- SUBSCRIPTION ACTIONS ---
      addSubscription: (sub) => {
        const subs = get().subscriptions;
        const exists = subs.find(
          (s) => s.id === sub.id && s.frequency === sub.frequency
        );

        if (!exists) set({ subscriptions: [...subs, sub] });
      },

      removeSubscription: (id) =>
        set({ subscriptions: get().subscriptions.filter((s) => s.id !== id) }),

      clearSubscriptions: () => set({ subscriptions: [] }),
    }),

    {
      name: 'cart-store',
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;
