import { IOrderRepository } from "../repositories/IOrderRepository";
import { ICartRepository } from "../repositories/ICartRepository";
import { orderEntity } from "../entities/order.entity";
import { CreateOrderDto, UpdateOrderDto } from "../dtos/Order.dto";
import { IUserRepository } from "../repositories/IUserRepository";
import { IProductRepository } from "../repositories/IProductRepository";
import { ProductVariationEntity } from "../entities/product.entity";
import { BuyNowDto } from "../dtos/Order.dto";
export class OrderUseCase{
    constructor(private orderRepository:IOrderRepository,private cartRepository:ICartRepository,private userRepository:IUserRepository,private productRepository:IProductRepository){}
    async createOrderFromCart(payload: CreateOrderDto, userId: string): Promise<orderEntity> {
        const cart = await this.cartRepository.findByUserId(userId);

        if (!cart || cart.items.length === 0 || cart.userId !== userId) {
            throw new Error('Invalid or empty cart or unauthorized access.');
        }

        for(const cartItem of cart.items){
            const product= await this.productRepository.findById(cartItem.productVariation.id);
            if (!product) {
                throw new Error(`Product with ID ${cartItem.productVariation.id} not found.`);
            }
            const productVariation = product.variations.find(
                (variation: ProductVariationEntity) => variation.id === cartItem.productVariationId
            );

            if (!productVariation) {
                throw new Error(`Product variation with ID ${cartItem.productVariationId} not found within product ${product.id}.`);
            }

            if (productVariation.stock < cartItem.quantity) {
                throw new Error(`Insufficient stock for product: ${productVariation.id}. Available: ${productVariation.stock}, Requested: ${cartItem.quantity}`);
            }
        }
        const paymentSuccessful = await this.processPayment(cart.totalAmount, payload.paymentMethod);
        if (!paymentSuccessful) {
            throw new Error('Payment failed. Please try again.');
        }
        for (const cartItem of cart.items) {
            const product = await this.productRepository.findById(cartItem.productId);
            if (product) {
                const productVariationToUpdate = product.variations.find(
                    (variation: ProductVariationEntity) => variation.id === cartItem.productVariationId
                );
                if (productVariationToUpdate) {
                    const newStock = productVariationToUpdate.stock - cartItem.quantity;
                    await this.productRepository.updateProductVariationStock(cartItem.productVariationId, newStock);
                }
            }
        }

        const newOrder = await this.orderRepository.createOrder(cart, {
            ...payload,
            paymentMethod: payload.paymentMethod,
            shippingAddress: payload.shippingAddress,
            contactInfo: payload.contactInfo,
        });
        
        await this.cartRepository.clearCart(cart.id);
        
        return newOrder;
    }
    async getAllOrders(): Promise<orderEntity[]> {
        const orders = await this.orderRepository.findAll();
        return orders;
    }
    async getOrderBuUserId(userId:string):Promise<orderEntity[]>{
        const order = await this.orderRepository.findByUserId(userId);
        return order;
    }
    async getOrderDetail(orderId:string,userId:string):Promise<orderEntity>{
        const order = await this.orderRepository.findById(orderId);
        if(!order){
            throw new Error('order not found')
        }
        if(order.userId !== userId){
            throw new Error('Unauthorized access to order details.');
        }
        return order
    }
    async updateOrder(orderId: string, data: UpdateOrderDto): Promise<orderEntity | null> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new Error('Order not found.');
        }

        const updatedOrder = await this.orderRepository.updateOrder(orderId, data);
        return updatedOrder;
    }
    async deleteOrder(orderId: string): Promise<boolean> {
        const success = await this.orderRepository.deleteOrder(orderId);
        if (!success) {
            throw new Error(`Failed to delete order ${orderId}.`);
        }
        return success;
    }
    async buyNow(payload: BuyNowDto, userId: string): Promise<orderEntity> {
        // 1. Validate Product and Stock
        const product = await this.productRepository.findByProductVariationId(payload.productVariationId);

        if (!product) {
            throw new Error(`Product for variation ID ${payload.productVariationId} not found.`);
        }

        const productVariation = product.variations.find(
            (variation: ProductVariationEntity) => variation.id === payload.productVariationId
        );

        if (!productVariation) {
            throw new Error(`Product variation with ID ${payload.productVariationId} not found within product ${product.id}.`);
        }

        if (productVariation.stock < payload.quantity) {
            throw new Error(`Insufficient stock for product: ${productVariation.id}. Available: ${productVariation.stock}, Requested: ${payload.quantity}`);
        }

        // 2. Process Payment
        // Use the productVariation's price for calculation
        const itemPrice = productVariation.salePrice !== null && productVariation.salePrice !== undefined ? productVariation.salePrice : productVariation.price;
        const totalAmount = itemPrice * payload.quantity;

        const paymentSuccessful = await this.processPayment(totalAmount, { method: payload.paymentMethod });
        if (!paymentSuccessful) {
            throw new Error('Payment failed. Please try again.');
        }

        // 3. Update Stock
        const newStock = productVariation.stock - payload.quantity;
        await this.productRepository.updateProductVariationStock(payload.productVariationId, newStock);

        // 4. Create Order
        const newOrder = await this.orderRepository.createOrderFromProduct(
            userId,
            payload.productVariationId,
            payload.quantity,
            itemPrice, // Pass the actual price for the order item
            {
                paymentMethod: payload.paymentMethod,
                shippingAddress: payload.shippingAddress,
                contactInfo: payload.contactInfo,
            }
        );

        return newOrder;
    }
    private async processPayment(amount: number, paymentDetails: any): Promise<boolean> {
        console.log(`Processing payment of ${amount} with details:`, paymentDetails);
        return new Promise(resolve => setTimeout(() => {
            if (amount > 0 && paymentDetails && paymentDetails.method) {
                console.log("Payment successful!");
                resolve(true);
            } else {
                console.error("Payment failed: Invalid amount or details.");
                resolve(false);
            }
        }, 1500)); 
    }

}