// lib/api/cart.ts
import { useAuthStore } from "@/store/authStore";
import { AddToCartDTO } from "@/core/dtos/Cart.dto";

export const getCart = async () => {
  const { user, token } = useAuthStore.getState();
  if (!user?.id) throw new Error("User not authenticated");

  const response = await fetch("/api/cart", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-User-Id": user.id, // Send userId in header
    },
    credentials: "include", // Include cookies if token is in HTTP-only cookie
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cart");
  }

  return response.json();
};

export const addToCart = async (dto: AddToCartDTO) => {
  const { user, token } = useAuthStore.getState();
  if (!user?.id) throw new Error("User not authenticated");

  const response = await fetch("/api/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-User-Id": user.id,
    },
    credentials: "include",
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    throw new Error("Failed to add item to cart");
  }

  return response.json();
};

// Similar functions for updateCartItem, removeCartItem, clearCart