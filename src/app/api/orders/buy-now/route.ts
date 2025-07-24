import { NextRequest, NextResponse } from "next/server";
import { OrderUseCase } from "@/core/usecases/Order.usecase";
import { OrderRepository } from "@/core/repositories/IOrderRepository";
import { ProductRepository } from "@/core/repositories/IProductRepository";
import { PrismaUserRepository } from "@/core/repositories/IUserRepository";
import { CartRepository } from "@/core/repositories/ICartRepository";
import { BuyNowDto } from "@/core/dtos/Order.dto";
import { validateAuth } from "../../middleware/validAuth";

const orderRepository = new OrderRepository();
const cartRepository = new CartRepository();
const userRepository = new PrismaUserRepository();
const productRepository = new ProductRepository();
const orderUseCase = new OrderUseCase(
    orderRepository,
    cartRepository,
    userRepository,
    productRepository
);

export async function POST(req: NextRequest) {
    try {
        const payload: BuyNowDto = await req.json();
        const auth = await validateAuth(req);

        if (auth instanceof NextResponse) return auth;
        if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = auth.userId;
        if (!userId) {
            return NextResponse.json({ message: 'User ID is required for buy now.' }, { status: 401 });
        }

        const newOrder = await orderUseCase.buyNow(payload, userId);

        return NextResponse.json(
            {
                message: 'Product purchased successfully!',
                order: newOrder,
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('Error processing buy now:', error);
        if (error instanceof Error) {
            if (error.message.includes('Product not found') || error.message.includes('Insufficient stock')) {
                return NextResponse.json({ message: error.message }, { status: 400 });
            }
            if (error.message.includes('Payment failed')) {
                return NextResponse.json({ message: error.message }, { status: 402 });
            }
            return NextResponse.json(
                {
                    message: 'Failed to process buy now.',
                    error: error.message,
                },
                { status: 500 }
            );
        }
        return NextResponse.json({ message: 'Failed to process buy now.', error: 'Unknown error' }, { status: 500 });
    }
}