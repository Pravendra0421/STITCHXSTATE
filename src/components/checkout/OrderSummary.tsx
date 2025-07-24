// src/components/checkout/OrderSummary.tsx
'use client';
import { CartEntity } from "@/core/entities/cart.entity"; // Assuming this path
import { orderEntity } from "@/core/entities/order.entity";
import React from "react";

interface OrderSummaryProps {
    // This prop can now be either a CartEntity or an OrderEntity
    data: CartEntity | orderEntity;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ data }) => {
    // Type guard to check if the data is a CartEntity
    const isCart = 'totalAmount' in data;

    // Use the correct properties based on the data type
    const items = data.items;

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Order Summary</h2>
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                        <img
                            // Access productVariation and its images
                            src={item.productVariation.images[0]?.url || 'https://placehold.co/80x80/cccccc/ffffff?text=No+Image'}
                            alt={item.productVariation.id}
                            className="w-20 h-20 rounded-md object-cover"
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/80x80/cccccc/ffffff?text=Image+Error'; }}
                        />
                        <div className="flex-1">
                            <p className="text-sm text-gray-600">
                                {item.productVariation.color && `Color: ${item.productVariation.color}`}
                                {item.productVariation.size && ` | Size: ${item.productVariation.size}`}
                            </p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900">
                            Rs. {(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderSummary;