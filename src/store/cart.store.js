import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';

const useCartStore = create(
  persist(
    (set, get) => ({
      // --- CART STATE ---
      items: [], // Mixed array: one-time and subscription items
      isOpen: false,
      cartId: null, // Store the cart ID from backend

      // --- COMPUTED GETTERS ---
      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      // Get only one-time items
      getOneTimeItems: () => get().items.filter(item => !item.isSubscription),
      getOneTimeSubtotal: () => 
        get().items
          .filter(item => !item.isSubscription)
          .reduce((sum, i) => sum + i.price * i.quantity, 0),

      // Get only subscription items
      getSubscriptionItems: () => get().items.filter(item => item.isSubscription),
      getSubscriptionSubtotal: () => 
        get().items
          .filter(item => item.isSubscription)
          .reduce((sum, i) => sum + i.price * i.quantity, 0),

      // Get unique subscription plans in cart
      getSubscriptionPlans: () => {
        const subscriptionItems = get().items.filter(item => item.isSubscription);
        const uniquePlans = [];
        const seenPlans = new Set();
        
        subscriptionItems.forEach(item => {
          if (item.subscriptionPlanId && !seenPlans.has(item.subscriptionPlanId)) {
            seenPlans.add(item.subscriptionPlanId);
            uniquePlans.push({
              planId: item.subscriptionPlanId,
              stripePriceId: item.stripePriceId,
              frequency: item.frequency,
              intervalCount: item.intervalCount,
              discountPercentage: item.discountPercentage
            });
          }
        });
        
        return uniquePlans;
      },

      // Check if cart has mixed items
      hasMixedItems: () => {
        const items = get().items;
        const hasOneTime = items.some(item => !item.isSubscription);
        const hasSubscriptions = items.some(item => item.isSubscription);
        return hasOneTime && hasSubscriptions;
      },

      // --- CART ACTIONS ---
      addItem: (product) => {
        const items = get().items;
        const existingIndex = items.findIndex((i) => 
          i.id === product.id && 
          i.isSubscription === product.isSubscription &&
          i.subscriptionPlanId === product.subscriptionPlanId
        );

        let updatedItems;
        
        if (existingIndex >= 0) {
          // Update existing item
          updatedItems = [...items];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + (product.quantity || 1)
          };
        } else {
          // Add new item
          const newItem = {
            ...product,
            quantity: product.quantity || 1,
            addedAt: new Date().toISOString(),
            cartItemId: `ci_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          };
          updatedItems = [...items, newItem];
        }

        set({ items: updatedItems });
        
        // Show appropriate toast message
        if (product.isSubscription) {
          toast.success(`Added ${product.name} as subscription!`);
        } else {
          toast.success(`${product.name} added to cart!`);
        }
      },

      removeItem: (cartItemId) => {
        const items = get().items;
        const itemToRemove = items.find(item => item.cartItemId === cartItemId);
        
        if (itemToRemove) {
          const updatedItems = items.filter((item) => item.cartItemId !== cartItemId);
          set({ items: updatedItems });
          
        }
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item
          ),
        });
      },

      // Update subscription frequency for an item
      updateSubscriptionFrequency: (cartItemId, newPlan) => {
        const items = get().items;
        const itemIndex = items.findIndex(item => item.cartItemId === cartItemId);
        
        if (itemIndex >= 0 && items[itemIndex].isSubscription) {
          const updatedItems = [...items];
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            subscriptionPlanId: newPlan.id,
            stripePriceId: newPlan.stripe_price_id,
            frequency: newPlan.interval_type,
            intervalCount: newPlan.interval_count,
            discountPercentage: newPlan.discount_percentage
          };
          
          set({ items: updatedItems });
          toast.success(`Subscription frequency updated to ${newPlan.interval_type}`);
        }
      },

      clearCart: () => {
        set({ items: [], cartId: null });
      },

      toggleCart: () => set({ isOpen: !get().isOpen }),

      // Set cart ID from backend
      setCartId: (cartId) => set({ cartId }),

      // Sync cart with backend (for guest/user cart merging)
      syncCartWithBackend: async (backendCartId) => {
        // This would be implemented when you have API endpoints
        // For now, just store the cart ID
        set({ cartId: backendCartId });
      },

      // --- CHECKOUT PREPARATION ---
      // Prepare payload for checkout
      prepareCheckoutPayload: (x) => {
        const items = get().items;
        
        // Group items by type
        const oneTimeItems = items.filter(item => !item.isSubscription);
        const subscriptionItems = items.filter(item => item.isSubscription);
        
        // Calculate totals
        const oneTimeTotal = oneTimeItems.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        );
        
        const subscriptionTotal = subscriptionItems.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        );
        
        const total = oneTimeTotal + subscriptionTotal;
        
        // Prepare subscription plans data
        const subscriptionPlans = get().getSubscriptionPlans();
        
        return {
          cartId: get().cartId,
          items: items.map(item => ({
            productId: item.id,
            variantId: item.variantId || null, // Use variantId if available
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            sku: item.sku,
            isSubscription: item.isSubscription || false,
            subscriptionPlanId: item.subscriptionPlanId || null,
            stripePriceId: item.stripePriceId || null,
            frequency: item.frequency || null,
            intervalCount: item.intervalCount || 1,
            discountPercentage: item.discountPercentage || 0
          })),
          totals: {
            oneTimeSubtotal: oneTimeTotal,
            subscriptionSubtotal: subscriptionTotal,
            subtotal: total,
            total: x
          },
          subscriptionPlans,
          hasMixedItems: get().hasMixedItems(),
          hasSubscriptions: subscriptionItems.length > 0,
          hasOneTimeItems: oneTimeItems.length > 0
        };
      },

      // --- CART VALIDATION ---
      validateCartForCheckout: () => {
        const items = get().items;
        
        if (items.length === 0) {
          return { valid: false, error: "Your cart is empty" };
        }
        
        // Check for subscription items without required data
        const subscriptionItems = items.filter(item => item.isSubscription);
        const invalidSubscriptions = subscriptionItems.filter(item => 
          !item.subscriptionPlanId || !item.stripePriceId
        );
        
        if (invalidSubscriptions.length > 0) {
          return { 
            valid: false, 
            error: "Some subscription items are missing plan information" 
          };
        }
        
        return { valid: true, error: null };
      },

      // --- CART HELPERS ---
      getItemCount: (productId, isSubscription = false, subscriptionPlanId = null) => {
        const items = get().items;
        const matchingItem = items.find(item => 
          item.id === productId && 
          item.isSubscription === isSubscription &&
          (isSubscription ? item.subscriptionPlanId === subscriptionPlanId : true)
        );
        
        return matchingItem ? matchingItem.quantity : 0;
      },

      // Check if product is already in cart (with specific subscription plan)
      isProductInCart: (productId, isSubscription = false, subscriptionPlanId = null) => {
        const items = get().items;
        return items.some(item => 
          item.id === productId && 
          item.isSubscription === isSubscription &&
          (isSubscription ? item.subscriptionPlanId === subscriptionPlanId : true)
        );
      },

      // Get cart summary for display
      getCartSummary: () => {
        const items = get().items;
        const oneTimeItems = items.filter(item => !item.isSubscription);
        const subscriptionItems = items.filter(item => item.isSubscription);
        
        return {
          totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
          oneTimeCount: oneTimeItems.reduce((sum, i) => sum + i.quantity, 0),
          subscriptionCount: subscriptionItems.reduce((sum, i) => sum + i.quantity, 0),
          subtotal: get().getSubtotal(),
          uniqueProducts: items.length,
          hasSubscriptions: subscriptionItems.length > 0
        };
      },

      // Clear only subscription items
      clearSubscriptions: () => {
        set({
          items: get().items.filter(item => !item.isSubscription)
        });
      },

      // Clear only one-time items
      clearOneTimeItems: () => {
        set({
          items: get().items.filter(item => item.isSubscription)
        });
      }
    }),

    {
      name: 'tcsc-cart-store',
      getStorage: () => localStorage,
      // Only persist items and cartId
      partialize: (state) => ({ 
        items: state.items,
        cartId: state.cartId
      }),
    }
  )
);

export default useCartStore;