// src/app/api/category/[categoryId]/products/route.ts

import { NextResponse } from "next/server";
// Make sure to import the CONCRETE ProductRepository, not the interface
import { ProductRepository } from "@/core/repositories/IProductRepository";
import { GetProductsByCategoryUseCase } from "@/core/usecases/getProductByCategoryId";

// Initialize repository and use case outside the handler for performance
// This ensures they are only instantiated once per server instance (or per cold start)
const productRepository = new ProductRepository();
const getProductsByCategoryUseCase = new GetProductsByCategoryUseCase(productRepository);

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const { id } = params; // Access categoryId directly

        if (!id) {
            return NextResponse.json({ message: 'Missing category ID in request' }, { status: 400 });
        }

        const products = await getProductsByCategoryUseCase.execute(id);

        // It's possible for a category to exist but have no products.
        // Returning an empty array with 200 status is generally preferred
        // over 404 for "no results found" in a collection.
        return NextResponse.json(products, { status: 200 });

    } catch (error: unknown) {
        console.error('Error fetching products by category ID:', error);
        return NextResponse.json(
            { message: "Failed to fetch products for category", error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// Optional: Add more specific revalidation if needed
// export const revalidate = 0; // Disable caching for this route for development, or set a time like 60;