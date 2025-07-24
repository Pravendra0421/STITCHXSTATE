
'use client';

import { CategoryEntity } from '@/core/entities/category.entity'; 
import Link from 'next/link';
import { CategoryApiRepository } from '@/infrastructure/frontend/repositories/CategoryRepository.api';
import { deleteCategoryUsecase } from '@/core/usecases/DeleteCategory.usecase';
import { useRouter } from 'next/navigation';

interface CategoryListTableProps {
  categories: CategoryEntity[];
}

export default function CategoryListTable({ categories }: CategoryListTableProps) {
  const router =useRouter();
  const categoryApiRepository = new CategoryApiRepository();
  const deleteCategoriesuseCase=new deleteCategoryUsecase(categoryApiRepository);
  const handleDelete = async(categoryId:string,categoryName:string)=>{
    if(window.confirm(`Are you want  to delete the category ${categoryName}? This action cannot be done`)){
      try {
        await deleteCategoriesuseCase.execute(categoryId);
        alert(`Category "${categoryName}" deleted successfully!`);
        router.refresh(); 
      } catch (error: any) {
        console.error('Failed to delete category:', error);
        alert(`Failed to delete category "${categoryName}": ${error.message}`);
      }
    }
  }
  // Defensive check: Ensure categories is an array before trying to map
  if (!Array.isArray(categories) || categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No categories found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th> 
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {/* --- UPDATED LOGIC FOR SINGLE IMAGE URL --- */}
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={`${category.name} Image`} // Better alt text
                    className="h-10 w-10 object-cover rounded"
                  />
                ) : (
                  'No Image' // Display if imageUrl is null or undefined
                )}
                {/* --- END UPDATED LOGIC --- */}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(category.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link href={`/sxs_admin/categories/${category.id}/edit`}>
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  </Link>

                {/* You might want to make delete a form submission or a modal for confirmation */}
                    <button onClick={()=>handleDelete(category.id,category.name)}
                     className="text-red-600 hover:text-red-900">Delete
                     </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}