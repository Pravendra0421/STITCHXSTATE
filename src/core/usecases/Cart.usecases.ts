// core/usecases/CartUsecases.ts
import { ICartRepository } from "../repositories/ICartRepository";
import { AddToCartDTO, UpdateCartItemDTO, RemoveFromCartDTO } from "../dtos/Cart.dto";
import { CartEntity } from "../entities/cart.entity";

export class CartUsecases {
  constructor(private cartRepository: ICartRepository) {}

  async getOrCreateCart(userId: string): Promise<CartEntity> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.create(userId);
      if (!cart) {
        throw new Error("Failed to create cart after not finding existing one.");
      }
    }
    return cart; 
  }

  async getCart(userId: string): Promise<CartEntity> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    const cart = await this.cartRepository.getCartWithItems(userId);
    if (!cart) {
      throw new Error("Cart not found");
    }
    return cart;
  }

  async addToCart(dto: AddToCartDTO, userId: string): Promise<CartEntity> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    if (!dto.productVariationId || dto.quantity <= 0) {
      throw new Error("Invalid product variation ID or quantity");
    }
    return this.cartRepository.addItem(dto, userId);
  }

  async updateCartItem(dto: UpdateCartItemDTO): Promise<CartEntity> {
    if (!dto.cartItemId) {
      throw new Error("Cart item ID is required");
    }
    if (dto.quantity < 0) {
      throw new Error("Quantity cannot be negative");
    }
    return this.cartRepository.updateItem(dto);
  }

  async removeCartItem(dto: RemoveFromCartDTO): Promise<CartEntity> {
    if (!dto.cartItemId) {
      throw new Error("Cart item ID is required");
    }
    return this.cartRepository.removeItem(dto);
  }

  async clearCart(userId: string): Promise<CartEntity> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    return this.cartRepository.clearCart(userId);
  }
}