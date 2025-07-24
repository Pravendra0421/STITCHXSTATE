// THIS IS THE NEW, CORRECT WAY FOR APP ROUTER
import { NextResponse } from 'next/server';
import { GetAllProductsUseCase } from '@/core/usecases/GetAllProducts.usecase';
import { ProductRepository } from '@/core/repositories/IProductRepository';
import { CreateProductDTO } from '@/core/dtos/CreateProduct.dto';
import { CreateProductUseCase } from '@/core/usecases/CreateProduct.usecase';

// This is the Composition Root. It knows about everything and wires it all together.
export async function GET() {
  try {
    // 1. Instantiate the concrete repository (the adapter)
    const productRepository = new ProductRepository();

    // 2. Instantiate the use case and inject the repository
    const getAllProducts = new GetAllProductsUseCase(productRepository);

    // 3. Execute the use case to get the data
    const products = await getAllProducts.execute();

    // 4. Return the data in the required format
    return NextResponse.json(products);

  } catch (error: unknown) {
    console.error("Failed to fetch products:", error); // Keep logging for observability
    return NextResponse.json(
      { message: "An error occurred while fetching products." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Instantiate the repository and use case
    const productRepository = new ProductRepository();
    const createProduct = new CreateProductUseCase(productRepository);
    
    // 2. Parse and validate the incoming request body
    const productData: CreateProductDTO = await request.json();

    // 3. Execute the use case
    const newProduct = await createProduct.execute(productData);

    // 4. Return a success response
    return NextResponse.json(newProduct, { status: 201 }); // 201 Created

  } catch (error: unknown) {
    console.error("Failed to create product:", error);
    
    // Handle potential validation errors from the use case
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 }); // 400 Bad Request
    }
    
    return NextResponse.json(
      { message: "An internal error occurred while creating the product." },
      { status: 500 }
    );
  }
}