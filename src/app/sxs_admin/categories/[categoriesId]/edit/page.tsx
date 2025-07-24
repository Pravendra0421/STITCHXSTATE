import { CategoryRepository } from '@/core/repositories/ICategoryRepository';
import { getCategoryByIdUSeCase } from '@/core/usecases/GetCategoryById.usecase';
import { CategoryEditForm } from '../../(_components)/editCategoryForm';
import { notFound } from 'next/navigation'; 

export default async function CategoryEditPage({ params }: { params: Promise<{ categoriesId: string }> }) {
  const { categoriesId } = await params; 
  const categoryIdToUse = categoriesId;
  const categoryRepository = new CategoryRepository();
  const getCategoryByIdUseCase = new getCategoryByIdUSeCase(categoryRepository);

  let initialCategory;
  try {
    initialCategory = await getCategoryByIdUseCase.execute(categoryIdToUse);
  } catch (error) {
    console.error(`Error fetching category with ID ${categoryIdToUse} for edit:`, error);
   
  }

  if (!initialCategory) {
    notFound();
  }

  return (
    <div className="container min-h-screen  mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-white">Edit Category: {initialCategory.name}</h1>
      {/* Pass the fetched initialCategory data and the categoryId to your Client Component */}
      <CategoryEditForm initialCategory={initialCategory} categoryId={categoryIdToUse} />
    </div>
  );
}