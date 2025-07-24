
import Link from 'next/link';
import { CategoryEntity } from '@/core/entities/category.entity';
import CategoryListTable from './(_components)/CategoryListTable';
import { CategoryRepository } from '@/core/repositories/ICategoryRepository';
import { GetAllCategoriesUseCase } from '@/core/usecases/GetAllCategory.usecase';

export default async function AdminCategoryListPage() {
    const categoryRepository = new CategoryRepository();
    const getAllCategories = new GetAllCategoriesUseCase(categoryRepository);
    let categories: CategoryEntity[] = [];
    let error: string | null = null;

    try {
        // This fetch will happen on the server, Next.js handles the relative path
        categories = await getAllCategories.execute();
    } catch (err: any) {
        console.error("Error fetching categories:", err); 
        error = err.message || 'Failed to load categories.';
    }

    return (
        <div className="container mx-auto p-6 bg-white shadow-md rounded-lg overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Categories Management</h1>

            <div className="flex justify-end mb-4">
                <Link href="/sxs_admin/categories/add">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out">
                        Add New Category
                    </button>
                </Link>
            </div>

            {error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            ) : (
                <CategoryListTable categories={categories} />
            )}
        </div>
    );
}