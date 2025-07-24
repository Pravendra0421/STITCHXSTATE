import { ProductRepository } from '@/core/repositories/IProductRepository';
import { GetProductsByCategoryUseCase } from '@/core/usecases/getProductByCategoryId';
import { getCategoryByIdUSeCase } from '@/core/usecases/GetCategoryById.usecase';
import { CategoryRepository } from '@/core/repositories/ICategoryRepository';

import ProductGridDisplay from '../(component)/productGripDisplay';
import Link from 'next/link';

export default async function ProductByCategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {

  const { categoryId } = await params;

  // Initialize your repositories
  const productRepository = new ProductRepository();
  const categoryRepository = new CategoryRepository(); 

  // Initialize your use cases with the repositories
  const getProductsByCategoryUseCase = new GetProductsByCategoryUseCase(productRepository);
  const getCategoryByIdUseCase = new getCategoryByIdUSeCase(categoryRepository);

  // 2. Use the new 'categoryId' variable here
  const [products, category] = await Promise.all([
    getProductsByCategoryUseCase.execute(categoryId),
    getCategoryByIdUseCase.execute(categoryId)
  ]);

  // Handle case where category is not found
  if (!category) {
    return (
      <div className="container mx-auto p-4 py-8 text-center text-red-500">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        {/* This will now work correctly */}
        <p>The category with ID {categoryId} does not exist.</p>
        <Link href="/category" className="text-blue-600 hover:underline mt-4 block">
          Back to All Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Products in {category.name}
      </h1>

      {products.length > 0 ? (
        <ProductGridDisplay products={products} />
      ) : (
        <p className="text-center text-gray-500">No products found in this category.</p>
      )}

      <div className="text-center mt-8">
        <Link href="/category">
          <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md text-lg hover:bg-gray-300 transition-colors duration-200 shadow-md">
            Back to All Categories
          </button>
        </Link>
      </div>
    </div>
  );
}