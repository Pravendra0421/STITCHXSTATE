import { ProductVariationEntity } from "./product.entity";
export enum CartStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
    ABANDONED = 'abandoned',
}
export interface CartItemEntity {
    id: string;                        
    cartId: string;                   
    productVariationId: string;  
    productVariation: ProductVariationEntity; 
    productId: string;   
    quantity: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface CartEntity{
    id: string;
    userId?: string; 
    items: CartItemEntity[];

    totalAmount: number;             
    totalItems: number;               

    status: CartStatus;                
    createdAt: Date;
    updatedAt: Date;
    lastActivity: Date;
}