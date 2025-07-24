import { create } from 'zustand';
import { CartApiRepository } from '@/infrastructure/frontend/repositories/Cart.api';
import { CartEntity } from '@/core/entities/cart.entity';
import { AddToCartDTO, UpdateCartItemDTO, RemoveFromCartDTO } from '@/core/dtos/Cart.dto';

interface CartState {
  cart: CartEntity | null;
  loading: boolean;
  error: string | null;
  getCart: () => Promise<void>;
  addToCart: (dto: AddToCartDTO) => Promise<void>;
  updateCartItem: (dto: UpdateCartItemDTO) => Promise<void>;
  removeCartItem: (dto: RemoveFromCartDTO) => Promise<void>;
  clearCart: () => Promise<void>;
}

const cartApi = new CartApiRepository();

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  loading: false,
  error: null,

  getCart: async () => {
    set({ loading: true });
    try {
      const data = await cartApi.getCartWithItems();
      set({ cart: data, error: null });
    } catch (err) {
      set({ error: (err as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (dto: AddToCartDTO) => {
    set({ loading: true });
    try {
      const data = await cartApi.addItem(dto);
      set({ cart: data, error: null });
    } catch (err) {
      set({ error: (err as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateCartItem: async (dto: UpdateCartItemDTO) => {
    set({ loading: true });
    try {
      const data = await cartApi.updateItem(dto);
      set({ cart: data, error: null });
    } catch (err) {
      set({ error: (err as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  removeCartItem: async (dto: RemoveFromCartDTO) => {
    set({ loading: true });
    try {
      const data = await cartApi.removeItem(dto);
      set({ cart: data, error: null });
    } catch (err) {
      set({ error: (err as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  clearCart: async () => {
    set({ loading: true });
    try {
      const data = await cartApi.clearCart();
      set({ cart: data, error: null });
    } catch (err) {
      set({ error: (err as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));
