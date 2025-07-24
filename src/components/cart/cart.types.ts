
export type { AddToCartDTO, UpdateCartItemDTO, RemoveFromCartDTO, ClearCartDTO } from '@/core/dtos/Cart.dto';

import type { CartEntity,CartItemEntity,CartStatus } from '@/core/entities/cart.entity';
export type { CartEntity,CartItemEntity,CartStatus } from '@/core/entities/cart.entity';


import { ProductEntity } from '@/core/entities/product.entity';


export interface ProductVariationEntityForCart {
    id: string;
    price: number;
    salePrice?: number | null;
    stock: number;
    color?: string | null;
    size?: string | null;
    images: { url: string }[]; 
    product: ProductEntity; 
}
export interface CartItemEntityFrontend extends Omit<CartItemEntity, 'productVariation'> {
    productVariation: ProductVariationEntityForCart;
}

export interface CartEntityFrontend extends Omit<CartEntity, 'items'> {
    items: CartItemEntityFrontend[];
}

export interface ICartContext {
    cart: CartEntityFrontend | null;
    loading: boolean;
    error: string | null;
    isSidebarOpen: boolean;
    openSidebar: () => void;
    closeSidebar: () => void;
    addToCart: (productVariationId: string, quantity: number) => Promise<void>;
    updateCartItem: (cartItemId: string, newQuantity: number) => Promise<void>;
    removeCartItem: (cartItemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    fetchCart: () => Promise<void>;
}