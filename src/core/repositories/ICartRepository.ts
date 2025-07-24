import { CartEntity, CartItemEntity, CartStatus } from "../entities/cart.entity";
import { AddToCartDTO, UpdateCartItemDTO, RemoveFromCartDTO } from "../dtos/Cart.dto";
import prisma from "@/lib/prisma"; // Assuming this is your global PrismaClient instance
import { PrismaClient, Prisma } from "@prisma/client";

// Define a more specific type for the Prisma client methods used
type PrismaModelClient = Pick<
  PrismaClient,
  'cart' | 'cartItem' | 'productVariation' // Only include models/methods you actually use with 'tx' or 'prisma'
>;

// Define the correct union type for Prisma client or transaction client
type PrismaClientOrTransaction = PrismaClient | Prisma.TransactionClient;

// Define the interface for the Cart Repository
export interface ICartRepository {
  findByUserId(userId: string, txClient?: PrismaClientOrTransaction): Promise<CartEntity | null>;
  create(userId: string, txClient?: PrismaClientOrTransaction): Promise<CartEntity>;
  addItem(dto: AddToCartDTO, userId: string): Promise<CartEntity>;
  updateItem(dto: UpdateCartItemDTO): Promise<CartEntity>;
  removeItem(dto: RemoveFromCartDTO): Promise<CartEntity>;
  clearCart(userId: string): Promise<CartEntity>; // Changed to userId as per original comment
  getCartWithItems(userId: string): Promise<CartEntity | null>;
}

// Implement the Cart Repository
export class CartRepository implements ICartRepository {

  // Helper method to map Prisma's raw cart object to CartEntity
  private mapToCartEntity(cart: {
    id: string;
    userId: string | null;
    items: {
      id: string;
      cartId: string;
      productVariationId: string;
      productId:string,
      quantity: number;
      price: number;
      createdAt: Date;
      updatedAt: Date;
      productVariation: {
        id: string;
        productId: string | null;
        size: string;
        color: string;
        price: number;
        salePrice: number;
        stock: number;
        createdAt: Date;
        updatedAt: Date;
        images: { id: string; url: string; productVariationId: string | null; createdAt: Date }[];
      };
    }[];
    totalAmount: number;
    totalItems: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    lastActivity: Date;
  }): CartEntity {
    return {
      id: cart.id,
      userId: cart.userId ?? undefined,
      items: cart.items.map((item) => ({
        id: item.id,
        cartId: item.cartId,
        productId:item.productId,
        productVariationId: item.productVariationId,
        productVariation: {
          id: item.productVariation.id,
          productId: item.productVariation.productId ?? undefined,
          size: item.productVariation.size,
          color: item.productVariation.color,
          price: item.productVariation.price,
          salePrice: item.productVariation.salePrice,
          stock: item.productVariation.stock,
          createdAt: item.productVariation.createdAt,
          updatedAt: item.productVariation.updatedAt,
          images: item.productVariation.images.map((img) => ({
            id: img.id,
            url: img.url,
            productVariationId: img.productVariationId ?? undefined,
            createdAt: img.createdAt,
          })),
        },
        quantity: item.quantity,
        price: item.price,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      totalAmount: cart.totalAmount,
      totalItems: cart.totalItems,
      status: cart.status as CartStatus,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      lastActivity: cart.lastActivity,
    };
  }

  // Private helper to update cart totals and prices within a transaction if provided
  private async updateCartTotals(cartId: string, txClient?: PrismaClientOrTransaction): Promise<CartEntity> {
    // Use the provided transactional client or the global prisma client.
    // Assert txClient as PrismaClient to satisfy TypeScript when it's present,
    // and then pick specific models for type safety.
    const client: PrismaModelClient = (txClient || prisma) as PrismaClient;

    if (!cartId) throw new Error("Cart ID is required");

    // Fetch all cart items for the given cart
    const cartItems = await client.cartItem.findMany({ // Use 'client'
      where: { cartId },
      include: { productVariation: true },
    });

    // Update prices of each cart item to reflect current product variation prices (e.g., sale price changes)
    for (const item of cartItems) {
      await client.cartItem.update({ // Use 'client'
        where: { id: item.id },
        data: {
          price: item.productVariation.salePrice > 0 ? item.productVariation.salePrice : item.productVariation.price,
        },
      });
    }

    // Fetch updated cart items to ensure accurate total calculation after price updates
    const updatedItems = await client.cartItem.findMany({ // Use 'client'
      where: { cartId },
      include: { productVariation: true },
    });

    // Calculate total items and total amount
    const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    // Update the main Cart record in the database with new totals and last activity
    const updatedCart = await client.cart.update({ // Use 'client'
      where: { id: cartId },
      data: { totalItems, totalAmount, lastActivity: new Date() },
      include: { items: { include: { productVariation: { include: { images: true } } } } },
    });

    return this.mapToCartEntity(updatedCart);
  }

  async findByUserId(userId: string, txClient?: PrismaClientOrTransaction): Promise<CartEntity | null> {
    const client: PrismaModelClient = (txClient || prisma) as PrismaClient;
    if (!userId) throw new Error("User ID is required");

    const cart = await client.cart.findFirst({
      where: { userId, status: CartStatus.ACTIVE },
      include: {
        items: {
          include: {
            productVariation: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      // If no cart is found, attempt to create one. Pass the txClient to 'create' method
      // to ensure it operates within the same transaction if findByUserId was called in one.
      return await this.create(userId, txClient);
    }

    return this.mapToCartEntity(cart);
  }

  async create(userId: string, txClient?: PrismaClientOrTransaction): Promise<CartEntity> {
    const client: PrismaModelClient = (txClient || prisma) as PrismaClient;
    if (!userId) throw new Error("User ID is required");

    const cart = await client.cart.create({
      data: {
        userId,
        status: CartStatus.ACTIVE,
        totalAmount: 0,
        totalItems: 0,
        lastActivity: new Date(),
      },
      include: {
        items: {
          include: {
            productVariation: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    return this.mapToCartEntity(cart);
  }

  async addItem(dto: AddToCartDTO, userId: string): Promise<CartEntity> {
    const { productVariationId, quantity } = dto;
    if (!userId) throw new Error("User ID is required");
    if (!productVariationId) throw new Error("Product variation ID is required");
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    return await prisma.$transaction(async (tx) => {
      // Pass the transaction client 'tx' to findByUserId
      const cart = await this.findByUserId(userId, tx);
      if (!cart) {
        throw new Error("Cart not found");
      }

      const productVariation = await tx.productVariation.findUnique({
        where: { id: productVariationId },
        include: { images: true },
      });

      if (!productVariation) {
        throw new Error("Product variation not found");
      }

      if (productVariation.stock < quantity) {
        throw new Error("Insufficient stock");
      }

      // Decrease stock
      await tx.productVariation.update({
        where: { id: productVariationId },
        data: { stock: productVariation.stock - quantity },
      });

      const existingItem = await tx.cartItem.findUnique({
        where: {
          cartId_productVariationId: {
            cartId: cart.id,
            productVariationId,
          },
        },
      });

      if (existingItem) {
        await tx.cartItem.update({
          where: {
            cartId_productVariationId: {
              cartId: cart.id,
              productVariationId,
            },
          },
          data: {
            quantity: existingItem.quantity + quantity,
            price: productVariation.salePrice > 0 ? productVariation.salePrice : productVariation.price,
          },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productVariationId,
            productId:productVariation.productId,
            quantity,
            price: productVariation.salePrice > 0 ? productVariation.salePrice : productVariation.price,
          },
        });
      }

      // Use the helper to update cart totals, passing the transaction client 'tx'
      return this.updateCartTotals(cart.id, tx);
    });
  }

  async updateItem(dto: UpdateCartItemDTO): Promise<CartEntity> {
    const { cartItemId, quantity } = dto;

    if (!cartItemId) throw new Error("Cart item ID is required");

    return await prisma.$transaction(async (tx) => {
      const cartItem = await tx.cartItem.findUnique({
        where: { id: cartItemId },
        include: { productVariation: true },
      });

      if (!cartItem) {
        throw new Error("Cart item not found");
      }

      if (quantity <= 0) {
        await tx.cartItem.delete({ where: { id: cartItemId } });
        // Return stock to product variation
        await tx.productVariation.update({
          where: { id: cartItem.productVariationId },
          data: { stock: cartItem.productVariation.stock + cartItem.quantity },
        });
      } else {
        const quantityDiff = quantity - cartItem.quantity;
        if (cartItem.productVariation.stock < quantityDiff) {
          throw new Error("Insufficient stock");
        }

        // Adjust stock for the difference in quantity
        await tx.productVariation.update({
          where: { id: cartItem.productVariationId },
          data: { stock: cartItem.productVariation.stock - quantityDiff },
        });

        // Update the cart item quantity and price
        await tx.cartItem.update({
          where: { id: cartItemId },
          data: {
            quantity,
            price: cartItem.productVariation.salePrice > 0 ? cartItem.productVariation.salePrice : cartItem.productVariation.price,
          },
        });
      }

      // Use the helper to update cart totals, passing the transaction client 'tx'
      return this.updateCartTotals(cartItem.cartId, tx);
    });
  }

  async removeItem(dto: RemoveFromCartDTO): Promise<CartEntity> {
    const { cartItemId } = dto;

    if (!cartItemId) throw new Error("Cart item ID is required");

    return await prisma.$transaction(async (tx) => {
      const cartItem = await tx.cartItem.findUnique({
        where: { id: cartItemId },
        include: { productVariation: true },
      });

      if (!cartItem) {
        throw new Error("Cart item not found");
      }

      // Delete the cart item
      await tx.cartItem.delete({ where: { id: cartItemId } });

      // Return stock to product variation
      await tx.productVariation.update({
        where: { id: cartItem.productVariationId },
        data: { stock: cartItem.productVariation.stock + cartItem.quantity },
      });

      // Use the helper to update cart totals, passing the transaction client 'tx'
      return this.updateCartTotals(cartItem.cartId, tx);
    });
  }

  // Changed to accept userId for consistency with other user-bound operations
  async clearCart(userId: string): Promise<CartEntity> {
    if (!userId) throw new Error("User ID is required");

    return await prisma.$transaction(async (tx) => {
      // Find the cart by userId first
      const cart = await tx.cart.findFirst({
        where: { userId, status: CartStatus.ACTIVE },
        include: { items: { include: { productVariation: true } } }, // Include items to return stock
      });

      if (!cart) {
        throw new Error("Cart not found for this user");
      }

      // Return stock for all items in the cart
      for (const item of cart.items) {
        await tx.productVariation.update({
          where: { id: item.productVariationId },
          data: { stock: item.productVariation.stock + item.quantity },
        });
      }

      // Delete all cart items for this cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      // Use the helper to update cart totals (which will now be 0 items, 0 amount), passing 'tx'
      return this.updateCartTotals(cart.id, tx);
    });
  }

  async getCartWithItems(userId: string): Promise<CartEntity | null> {
    if (!userId) throw new Error("User ID is required");

    // This is a read-only operation, so direct prisma client is fine.
    // If you need it to be part of an *optional* larger transaction,
    // you would add txClient parameter and use (txClient || prisma).
    const cart = await prisma.cart.findFirst({
      where: { userId, status: CartStatus.ACTIVE },
      include: {
        items: {
          include: {
            productVariation: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    return cart ? this.mapToCartEntity(cart) : null;
  }
}
