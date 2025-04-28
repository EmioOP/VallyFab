
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CartStore = {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  decreaseQuantity: (productId: string) => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    immer((set) => ({
      cartItems: [],
      
      // Add to Cart
      addToCart: (product) => set((state) => {
        const existingItem = state.cartItems.find(
          item => item.id === product.id
        );

        if (existingItem) {
          existingItem.quantity++;
        } else {
          state.cartItems.push({ ...product, quantity: 1 });
        }
      }),

      // Remove Item
      removeFromCart: (productId) => set((state) => {
        state.cartItems = state.cartItems.filter(
          item => item.id !== productId
        );
      }),

      // Clear Cart
      clearCart: () => set((state) => {
        state.cartItems = [];
      }),

      // Decrease Quantity
      decreaseQuantity: (productId) => set((state) => {
        const index = state.cartItems.findIndex(
          item => item.id === productId
        );

        if (index !== -1) {
          if (state.cartItems[index].quantity > 1) {
            state.cartItems[index].quantity--;
          } else {
            state.cartItems.splice(index, 1);
          }
        }
      }),
    })),
    {
      name: 'vallyfab-cart',
      getStorage: () => localStorage,
    }
  )
);