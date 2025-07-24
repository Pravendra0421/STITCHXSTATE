import { orderEntity,OrderItemEntity,AddressEntity,ContactInfoEntity } from "../entities/order.entity";
import { CartEntity,CartItemEntity } from "../entities/cart.entity";
import { ProductVariationEntity } from "../entities/product.entity";
import { UpdateOrderDto } from "../dtos/Order.dto";
import prisma from "@/lib/prisma";
type PaymentMethodType = 'Stripe' | 'COD' | 'UPI';
export interface IOrderRepository{
    createOrder(cartData:any,orderDetails:any):Promise<orderEntity>;
    findById(orderId:string):Promise<orderEntity |null>
    findByUserId(userId: string): Promise<orderEntity[]>;
    findAll(): Promise<orderEntity[]>;
    updateOrder(orderId: string, data:UpdateOrderDto): Promise<orderEntity | null>;
    deleteOrder(orderId: string): Promise<boolean>;
    createOrderFromProduct(
        userId: string,
        productVariationId: string,
        quantity: number,
        price: number, // Add price here, as it's not coming from cart item
        orderDetails: {
            paymentMethod?: PaymentMethodType;
            shippingAddress?: AddressEntity;
            contactInfo?: ContactInfoEntity;
        }
    ): Promise<orderEntity>;
}
export class OrderRepository implements IOrderRepository {

    private mapPrismaOrderToOrderEntity(prismaOrder: any): orderEntity {
        const shippingAddress: AddressEntity = prismaOrder.shippingAddress as AddressEntity;
        const contactInfo: ContactInfoEntity = prismaOrder.contactInfo as ContactInfoEntity;
        const items: OrderItemEntity[] = prismaOrder.orderItems.map((item: any) => ({
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
                images: item.productVariation.images || [], 
                createdAt: item.productVariation.createdAt,
                updatedAt: item.productVariation.updatedAt,
            } as ProductVariationEntity, 
        }));

        return {
            id: prismaOrder.id,
            userId: prismaOrder.userId,
            status: prismaOrder.status,
            total: prismaOrder.total, 
            paymentMethod: prismaOrder.paymentMethod, 
            shippingAddress: shippingAddress,
            contactInfo: contactInfo,
            items: items,
            createdAt: prismaOrder.createdAt,
            updatedAt: prismaOrder.updatedAt,

            couponId: prismaOrder.couponId,
            coupon: prismaOrder.coupon,
        } as orderEntity; 
    }

    async createOrder(cartData: CartEntity, orderDetails: any): Promise<orderEntity> {
        const order = await prisma.order.create({
            data: {
                userId: cartData.userId!,
                status: 'PENDING',
                total: cartData.totalAmount,
                paymentMethod: orderDetails.paymentMethod,
                shippingAddress: orderDetails.shippingAddress,
                contactInfo: orderDetails.contactInfo,
                orderItems: { 
                    create: cartData.items.map((item: CartItemEntity) => ({
                        productVariationId: item.productVariationId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                orderItems: {
                    include: {
                        productVariation: { 
                            include: {
                                images: true,
                                product:true
                            }
                        }
                    }
                }
            }
        });
        
        return this.mapPrismaOrderToOrderEntity(order);
    }
    async findAll(): Promise<orderEntity[]> {
        const orders = await prisma.order.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                orderItems: {
                    include: {
                        productVariation: {
                            include: {
                                images: true,
                                product: true
                            }
                        }
                    }
                },
            }
        });
        return orders.map(order => this.mapPrismaOrderToOrderEntity(order));
    }
    async findById(orderId: string): Promise<orderEntity | null> {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: {
                    include: {
                        productVariation: { 
                            include: {
                                images: true,
                                product:true
                            }
                        }
                    }
                }
            },
        });

        if (!order) {
            return null;
        }
        return this.mapPrismaOrderToOrderEntity(order);
    }
    async findByUserId(userId: string): Promise<orderEntity[]> {
        const orders = await prisma.order.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' },
            include: {
                orderItems: {
                    include: {
                        productVariation: {
                            include: {
                                images: true,
                                product:true
                            }
                        }
                    }
                },
            }
        });
        return orders.map(order => this.mapPrismaOrderToOrderEntity(order));
    }
    async updateOrder(orderId: string, data: UpdateOrderDto): Promise<orderEntity | null> {
        const updateData: any = {};
        if (data.status !== undefined) updateData.status = data.status;
        if (data.total !== undefined) updateData.total = data.total;
        if (data.paymentMethod !== undefined) updateData.paymentMethod = data.paymentMethod;
        if (data.shippingAddress !== undefined) updateData.shippingAddress = data.shippingAddress;
        if (data.contactInfo !== undefined) updateData.contactInfo = data.contactInfo;
     
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: updateData, 
            include: {
                orderItems: {
                    include: {
                        productVariation: {
                            include: {
                                images: true,
                                product:true
                            }
                        }
                    }
                },
                coupon: true
            }
        });
        return this.mapPrismaOrderToOrderEntity(updatedOrder);
    }

    async deleteOrder(orderId: string): Promise<boolean> {
        try {
            await prisma.order.delete({
                where: { id: orderId },
            });
            return true;
        } catch (error) {
            console.error(`Error deleting order ${orderId}:`, error);
            return false;
        }
    }
    async createOrderFromProduct(
    userId: string,
    productVariationId: string,
    quantity: number,
    price: number,
    orderDetails: any 
): Promise<orderEntity> {
    const totalAmount = quantity * price; // Calculate total for this single item

    const order = await prisma.order.create({
        data: {
            userId: userId,
            status: 'PENDING', // Initial status
            total: totalAmount,
            paymentMethod: orderDetails.paymentMethod,
            shippingAddress: orderDetails.shippingAddress,
            contactInfo: orderDetails.contactInfo,
            orderItems: {
                create: {
                    productVariationId: productVariationId,
                    quantity: quantity,
                    price: price, // Store the price at the time of order
                },
            },
        },
        include: {
            orderItems: {
                include: {
                    productVariation: {
                        include: {
                            images: true,
                            product:true
                        }
                    }
                }
            }
        }
    });
    return this.mapPrismaOrderToOrderEntity(order);
}
}