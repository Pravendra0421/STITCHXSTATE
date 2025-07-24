import { NextResponse } from "next/server";
import { CategoryRepository } from "@/core/repositories/ICategoryRepository";
import { GetAllCategoriesUseCase } from "@/core/usecases/GetAllCategory.usecase";
import { CreateCategoryUseCase } from "@/core/usecases/CreateCategory.usecase";
import { CreateCategoryDTO } from "@/core/dtos/CreateCategory.dto";
export async function GET() {
  try {
    const categoryRepository = new CategoryRepository(); // Prisma implementation
    const getAllCategories = new GetAllCategoriesUseCase(categoryRepository);
    const categories = await getAllCategories.execute();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching categories." },
      { status: 500 }
    );
  }
}

// POST /api/categories
export async function POST(request: Request) {
  try {
    const categoryRepository = new CategoryRepository(); // Prisma implementation
    const createCategory = new CreateCategoryUseCase(categoryRepository);
    const categoryData: CreateCategoryDTO = await request.json();

    const newCategory = await createCategory.execute(categoryData);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Failed to create category:", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "An internal error occurred while creating the category." },
      { status: 500 }
    );
  }
}