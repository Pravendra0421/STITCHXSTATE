import { NextRequest, NextResponse } from "next/server";
import { OrderUseCase } from "@/core/usecases/Order.usecase";
import { OrderRepository } from "@/core/repositories/IOrderRepository";
import { ProductRepository } from "@/core/repositories/IProductRepository";
import { PrismaUserRepository } from "@/core/repositories/IUserRepository";
import { CartRepository } from "@/core/repositories/ICartRepository";
import { validateAuth } from "@/app/api/middleware/validAuth";

// Instantiate repositories and use case
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

export async function GET(req: NextRequest) {
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

        // Use the new use case to fetch all orders (admin check is inside)
        const orders = await orderUseCase.getAllOrders();

        return NextResponse.json({ orders }, { status: 200 });

    } catch (error: unknown) {
        console.error('Error fetching all orders:', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ message: error.message }, { status: 403 }); // Forbidden
        }
        return NextResponse.json(
            {
                message: 'Failed to fetch all orders.',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}