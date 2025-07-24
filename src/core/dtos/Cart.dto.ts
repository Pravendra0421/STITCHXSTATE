
export interface AddToCartDTO {
    productVariationId: string;
    quantity: number;

}


export interface UpdateCartItemDTO {
    cartItemId: string; // Update a specific cart item
    quantity: number;
}

// DTO for removing an item from the cart
export interface RemoveFromCartDTO {
    cartItemId: string; 
}


export interface ClearCartDTO {
    cartId: string; 
}