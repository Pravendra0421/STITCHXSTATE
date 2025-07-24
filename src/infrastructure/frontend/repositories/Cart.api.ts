// src/lib/cartApi.ts
import { ICartRepository } from "@/core/repositories/ICartRepository";
import { CartEntity, CartStatus } from "@/core/entities/cart.entity";
import { AddToCartDTO, RemoveFromCartDTO, UpdateCartItemDTO, ClearCartDTO } from "@/core/dtos/Cart.dto";

// Helper function to parse JSON data into CartEntity
const parseCartEntity = (data: any): CartEntity => {
  if (!data || typeof data.id !== 'string') {
    throw new Error('Invalid cart data structure');
  }

  return {
    id: data.id,
    userId: data.userId,
    items: data.items.map((item: any) => ({
      id: item.id,
      cartId: item.cartId,
      productVariationId: item.productVariationId,
      productVariation: {
        ...item.productVariation,
        createdAt: new Date(item.productVariation.createdAt),
        updatedAt: new Date(item.productVariation.updatedAt),
        images: item.productVariation.images.map((img: any) => ({
          ...img,
          createdAt: new Date(img.createdAt),
        })),
      },
      quantity: item.quantity,
      price: item.price,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    })),
    totalAmount: data.totalAmount,
    totalItems: data.totalItems,
    status: data.status as CartStatus,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
    lastActivity: new Date(data.lastActivity),
  };
};

export class CartApiRepository implements ICartRepository {

   async findByUserId(): Promise<CartEntity | null> {
    const response = await fetch('/api/cart', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch cart.');
    }

    const data = await response.json();
    return parseCartEntity(data);
  }

  async create(): Promise<CartEntity> {
    const response = await fetch('/api/cart', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create cart.');
    }

    const data = await response.json();
    return parseCartEntity(data);
  }

  async addItem(dto: AddToCartDTO): Promise<CartEntity> {
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to add item to cart.');
    }

    const data = await response.json();
    return parseCartEntity(data);
  }

  async updateItem(dto: UpdateCartItemDTO): Promise<CartEntity> {
    const response = await fetch('/api/cart/item', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update cart item.');
    }

    const data = await response.json();
    return parseCartEntity(data);
  }

  async removeItem(dto: RemoveFromCartDTO): Promise<CartEntity> {
    const response = await fetch('/api/cart/item', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to remove cart item.');
    }

    const data = await response.json();
    return parseCartEntity(data);
  }

  async clearCart(): Promise<CartEntity> {
    const cart = await this.findByUserId();
    if (!cart) throw new Error('Cart not found.');

    const response = await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ cartId: cart.id } as ClearCartDTO),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to clear cart.');
    }

    const data = await response.json();
    return parseCartEntity(data);
  }

  async getCartWithItems(): Promise<CartEntity | null> {
    return this.findByUserId();
  }
}