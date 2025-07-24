import { NextResponse } from "next/server";
import { CategoryRepository } from "@/core/repositories/ICategoryRepository";
import { getCategoryByIdUSeCase } from "@/core/usecases/GetCategoryById.usecase";
import { UpdateCategoryUseCase } from "@/core/usecases/UpdateCategory.usecase";
import { deleteCategoryUsecase } from "@/core/usecases/DeleteCategory.usecase";
import { CreateCategoryDTO } from "@/core/dtos/CreateCategory.dto";

const categoryRepository = new CategoryRepository;
const GetCategoryByIdUSeCase = new getCategoryByIdUSeCase(categoryRepository);
const updatecategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
const DeleteCategoryUseCase = new deleteCategoryUsecase(categoryRepository);

export async function GET(
    request:Request,
    {params}:{params:Promise<{id:string}>}
){
    try {
        const {id} = await params;
        if(!id){
            return NextResponse.json({message:'missing user id in request'},{status:400});
        }
        const category= await GetCategoryByIdUSeCase.execute(id);
        if(!category){
            return NextResponse.json({message:"category not found"},{status:404});
        }
        return NextResponse.json(category,{status:200})
    } catch (error: unknown) {
        console.error('error fetching by category by id:', error);
        return NextResponse.json({ message: "failed to fetch user", error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

export async function PUT(
    request:Request,{params}:{params:Promise<{id:string}>}
){
    try {
        const {id} = await params;
        if(!id){
            return NextResponse.json({message:'missing user id in request'},{status:400});
        }
        const body:CreateCategoryDTO = await request.json();
        const updateCategory =await updatecategoryUseCase.execute(id,body);
        if(!updateCategory){
            return NextResponse.json({message:"user not found "},{status:404});
        }
        return NextResponse.json(updateCategory,{status:200});
    } catch(error:unknown){
        console.error('error updating user ',error);
        return NextResponse.json({message:'Failed  to update user ', error:error instanceof Error ? error.message:'unknown error'},{status:500});
    }
}

export async function DELETE(
    request:Request,
    {params}:{params:Promise<{id:string}>}
){
    try {
        const {id} = await params;
        if (!id) {
            return NextResponse.json({ message: 'Missing user id in request' }, { status: 400 });
        }
        const deleteCategory = DeleteCategoryUseCase.execute(id);
        if (!deleteCategory) {
            return NextResponse.json({ message: 'category  not found' }, { status: 404 });
        }
        return NextResponse.json({message:"category deleted successfully"},{status:200});
    } catch (error: unknown) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { 
                message: 'Failed to delete user', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            }, 
            { status: 500 }
        );
    }
}