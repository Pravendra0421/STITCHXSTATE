import { IOrderRepository } from "@/core/repositories/IOrderRepository";
import { orderEntity, AddressEntity, ContactInfoEntity, OrderItemEntity } from "@/core/entities/order.entity";
import { CreateOrderDto, BuyNowDto, UpdateOrderDto } from "@/core/dtos/Order.dto";
import { CartEntity } from "@/core/entities/cart.entity";
import { PaymentMethodType } from "@/core/dtos/Order.dto";
// Helper function to get a cookie by name
const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') {
        return null;
    }
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length); 
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
};
const getAuthToken = (): string | null => {
    return getCookie('token');
};

const getCommonHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const parseOrderEntity = (data: any): orderEntity => {
    if (!data || typeof data.id !== 'string') {
        throw new Error('Invalid order data structure received from API'); 
    }
    const mappedItems: OrderItemEntity[] = data.items?.map((item: any) => ({
        id: item.id,
        orderId: item.orderId,
        productVariationId: item.productVariationId,
        quantity: item.quantity,
        price: item.price,
        productVariation: {
            id: item.productVariation.id,
            productId: item.productVariation.productId,
            size: item.productVariation.size,
            color: item.productVariation.color,
            price: item.productVariation.price,
            salePrice: item.productVariation.salePrice,
            stock: item.productVariation.stock,
            images: item.productVariation.images?.map((img: any) => ({
                id: img.id,
                url: img.url,
                variationId: img.variationId,
                createdAt: img.createdAt ? new Date(img.createdAt) : new Date(),
                updatedAt: img.updatedAt ? new Date(img.updatedAt) : new Date(),
            })) || [], 
            createdAt: item.productVariation.createdAt ? new Date(item.productVariation.createdAt) : new Date(),
            updatedAt: item.productVariation.updatedAt ? new Date(item.productVariation.updatedAt) : new Date(),
        },
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    })) || [];

    return {
        id: data.id,
        userId: data.userId,
        status: data.status,
        total: data.total, // Added total
        paymentMethod: data.paymentMethod, // Added paymentMethod
        shippingAddress: data.shippingAddress as AddressEntity,
        contactInfo: data.contactInfo as ContactInfoEntity,
        items: mappedItems,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    } as orderEntity;
};

export class OrderApiRepository implements IOrderRepository {
    async findAll(): Promise<orderEntity[]> {
        const response = await fetch(`/api/orders/all`, {
            method: 'GET',
            headers: getCommonHeaders(),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch all orders.');
        }

        const data = await response.json();
        return data.orders.map((order: any) => parseOrderEntity(order));
    }

    async createOrder(cartData: CartEntity, orderDetails:Omit<CreateOrderDto,'cartId'>): Promise<orderEntity> {
        const payload: CreateOrderDto = {
            cartId: cartData.id,
            ...orderDetails
        };

        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: getCommonHeaders(), 
            credentials: 'include',
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create order from cart.');
        }
        const data = await response.json();
        return parseOrderEntity(data.order); 
    }

    async createOrderFromProduct(
        productVariationId: string,
        userId: string, // This userId needs to be included in the body
        quantity: number,
        price: number,
        orderDetails: {
            paymentMethod: PaymentMethodType;
            shippingAddress: AddressEntity;
            contactInfo: ContactInfoEntity;
        }
    ): Promise<orderEntity> {
        const payload: BuyNowDto = {
            productVariationId: productVariationId,
            quantity: quantity,
            shippingAddress: orderDetails.shippingAddress,
            contactInfo: orderDetails.contactInfo,
            paymentMethod: orderDetails.paymentMethod,
            userId: userId, // Now correctly assigned
            price: price,
        };

        const response = await fetch('/api/orders/buy-now', {
            method: 'POST',
            headers: getCommonHeaders(),
            credentials: 'include',
             body: JSON.stringify(payload), 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to process buy now.');
        }
        const data = await response.json();
        return parseOrderEntity(data.order); 
    }

    async findById(orderId: string): Promise<orderEntity | null> {
        const response = await fetch(`/api/orders/single?orderId=${orderId}`, {
            method: 'GET',
            headers: getCommonHeaders(),
            credentials: 'include',
        });

        if (response.status === 404) {
            return null; // Order not found
        }
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to fetch order ${orderId} details.`);
        }
        const data = await response.json();
        return parseOrderEntity(data.order);
    }

    async findByUserId(userId: string): Promise<orderEntity[]> {
        const response = await fetch(`/api/orders?userId=${userId}`, {
            method: 'GET',
            headers: getCommonHeaders(),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch orders by user ID.');
        }
        const data = await response.json();
        return data.orders.map((order: any) => parseOrderEntity(order));
    }

    async updateOrder(orderId: string, data: UpdateOrderDto): Promise<orderEntity | null> {
    // CHANGE: URL ko query parameter use karne ke liye update kiya gaya hai
    const response = await fetch(`/api/orders/${orderId}`, { 
        method: 'PUT', 
        headers: getCommonHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update order ${orderId}.`);
    }
    const responseData = await response.json();
    return parseOrderEntity(responseData.order);
}

    async deleteOrder(orderId: string): Promise<boolean> {
        const response = await fetch(`/api/orders/single?orderId=${orderId}`, {
            method: 'DELETE',
            headers: getCommonHeaders(),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to delete order ${orderId}.`);
        }
        return true;
    }
}
