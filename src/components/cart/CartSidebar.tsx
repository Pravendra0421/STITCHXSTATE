'use client';

import React, { useEffect } from 'react';
import { useCartStore } from '@/hooks/useCart';
// Assuming CartItemEntity and CartEntity types correctly reflect nested structure including product name and images
import { CartEntity, CartItemEntity } from '@/core/entities/cart.entity'; // Using central entity definitions
import { XMarkIcon } from '@heroicons/react/24/outline'; // Close icon
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid'; // Icons for quantity and remove
import { useRouter } from 'next/navigation';
interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cart, loading, error, getCart, updateCartItem, removeCartItem } = useCartStore();
  const router = useRouter();
  useEffect(() => {
    // Only fetch cart if sidebar is open AND cart data is not already loaded or is null
    if (isOpen && !cart) {
      getCart();
    }
  }, [isOpen, cart, getCart]); // Dependency array: re-run if isOpen, cart, or getCart changes

  // If sidebar is not open, render nothing
  if (!isOpen) return null;

  // Handlers for quantity change and item removal
  const handleQuantityChange = async (itemId: string, currentQuantity: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      // If quantity becomes 0 or less, remove the item
      await removeCartItem({ cartItemId: itemId });
    } else {
      await updateCartItem({ cartItemId: itemId, quantity: newQuantity });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeCartItem({ cartItemId: itemId });
  };
  const handleCartCheckout = () => {
        if (!cart || cart.items.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const queryParams = new URLSearchParams({
            type: 'cart', 
            cartId: cart.id, 
        }).toString();

        router.push(`/checkout?${queryParams}`);
    };

  return (
    // Overlay for the sidebar
     <div className="fixed inset-0 z-50 flex justify-end backdrop-blur-sm">
      {/* Sidebar content area */}
      <div className="w-full max-w-md bg-white h-full shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>

        {/* Header section */}
        <div className="p-4 border-b flex justify-between items-center flex-shrink-0 relative"> {/* Added relative for absolute positioning of X */}
          <h2 className="text-xl font-bold text-gray-800 w-full text-center">CART</h2> {/* Centered 'CART' title */}
          {/* Custom close button to match image's 'X' placement */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <XMarkIcon className="w-6 h-6" /> {/* Using Heroicons XMarkIcon as it looks similar */}
          </button>
        </div>

        {/* Main content area (scrollable) */}
        <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
          {loading && <p className="text-center text-gray-600">Loading cart...</p>}
          {error && <p className="text-red-500 text-center">Error: {error}</p>}

          {!loading && !error && (!cart || cart.items.length === 0) ? (
            <p className="text-center text-gray-600 mt-8">Your cart is empty.</p>
          ) : (
            cart && (
              <>
                {/* Cart Items List */}
                {cart.items.map((item: CartItemEntity) => (
                  <div key={item.id} className="flex items-start gap-4 py-4 border-b last:border-b-0">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-24 h-24 rounded-none overflow-hidden bg-gray-100"> {/* Square image, no rounded corners */}
                      <img
                        src={item.productVariation.images && item.productVariation.images.length > 0
                          ? item.productVariation.images[0].url // Access .url property
                          : "https://placehold.co/96x96/E0E0E0/FFFFFF?text=No+Image" // Fallback image (96x96 for w-24 h-24)
                        }
                        alt={item.productVariation.id || "Product Image"} // Assuming product name is available
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details and Quantity Controls */}
                    <div className="flex-grow flex flex-col justify-between h-24"> {/* Ensure consistent height */}
                      {/* Product Name */}
                    
                      {/* Size and Color */}
                      <p className="text-xs text-gray-600 mb-2">
                        Color: {item.productVariation.color}
                      </p>
                      <p className="text-xs text-gray-600">
                        Size: {item.productVariation.size}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-md w-fit mt-auto"> {/* Aligned to bottom */}
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity, item.quantity - 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 text-gray-800 font-medium text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price and Remove Button (Right-aligned) */}
                    <div className="flex flex-col items-end flex-shrink-0 text-right h-24 justify-between">
                      <p className="font-medium text-gray-800 text-sm whitespace-nowrap">
                        Rs. {(item.quantity * item.price).toFixed(2)} {/* Changed to Rs. */}
                      </p>
                      {/* Remove button moved closer to price, at the top right of the item */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <TrashIcon className="w-4 h-4" /> 
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )
          )}
        </div>

        {/* Footer section (fixed at bottom) */}
        {cart && cart.items.length > 0 && (
          <div className="p-4 border-t bg-gray-50 flex-shrink-0 text-gray-700"> {/* Added text-gray-700 */}
            <div className="flex justify-between items-center mb-2">
              <p className="text-base font-normal">SUBTOTAL</p> {/* Font weight adjusted */}
              <p className="text-base font-medium whitespace-nowrap">Rs. {cart.totalAmount.toFixed(2)}</p> {/* Changed to Rs. */}
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Shipping, taxes, and discount codes calculated at checkout.
            </p>
            <button onClick={handleCartCheckout} className="w-full bg-black text-white py-3 rounded-none hover:bg-gray-800 transition-colors font-medium uppercase tracking-wide"> {/* Button style from image */}
              CHECK OUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
