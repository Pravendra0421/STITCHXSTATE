import { NextRequest,NextResponse } from "next/server";
import { OrderUseCase } from "@/core/usecases/Order.usecase";
import { OrderRepository } from "@/core/repositories/IOrderRepository";
import { ProductRepository } from "@/core/repositories/IProductRepository";
import { PrismaUserRepository } from "@/core/repositories/IUserRepository";
import { CartRepository } from "@/core/repositories/ICartRepository";
import { CreateOrderDto } from "@/core/dtos/Order.dto";
import { validateAuth } from "../middleware/validAuth";

const orderRepository= new OrderRepository();
const cartRepository=new CartRepository();
const userRepository=new PrismaUserRepository();
const productRepository=new ProductRepository();
const orderUseCase = new OrderUseCase(
    orderRepository,
    cartRepository,
    userRepository,
    productRepository
);
export async function POST(req: NextRequest) {
    try {
        const payload: CreateOrderDto = await req.json();
        const auth = await validateAuth(req);
        
          if (auth instanceof NextResponse) return auth;
        
          if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          }
        const userId = auth.userId;
        if (!userId) {
            return NextResponse.json({ message: 'User ID is required for order creation.' }, { status: 401 });
        }
        const newOrder = await orderUseCase.createOrderFromCart(payload, userId);
        return NextResponse.json(
            {
                message: 'Order created successfully!',
                order: newOrder,
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('Error creating order:', error);
        if (error instanceof Error) {
            if (error.message.includes('Invalid or empty cart') || error.message.includes('Unauthorized access')) {
                return NextResponse.json({ message: error.message }, { status: 400 });
            }
            if (error.message.includes('Product variation not found') || error.message.includes('Insufficient stock')) {
                return NextResponse.json({ message: error.message }, { status: 400 });
            }
            if (error.message.includes('Payment failed')) {
                return NextResponse.json({ message: error.message }, { status: 402 });
            }
            return NextResponse.json(
                {
                    message: 'Failed to create order.',
                    error: error.message,
                },
                { status: 500 }
            );
        }
        return NextResponse.json({ message: 'Failed to create order.', error: 'Unknown error' }, { status: 500 });
    }
}
export async function GET(req:NextRequest){
        try {
        const auth = await validateAuth(req);
        
          if (auth instanceof NextResponse) return auth;
        
          if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          }
        const userId = auth.userId;
        if (!userId) {
            return NextResponse.json({ message: 'User ID is required.' }, { status: 401 });
        }
        const orders = await orderUseCase.getOrderBuUserId(userId);

        return NextResponse.json({ orders }, { status: 200 });
            
        } catch (error: unknown) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            {
                message: 'Failed to fetch orders.',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}