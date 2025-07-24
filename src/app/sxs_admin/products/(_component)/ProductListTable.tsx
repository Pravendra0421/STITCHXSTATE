// src/app/sxs_admin/products/(_components)/ProductListTable.tsx
'use client';

import { ProductEntity } from '@/core/entities/product.entity';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // For page refresh
import { ProductApiRepository } from '@/infrastructure/frontend/repositories/ProductRepository.api';
import { deleteProductUsecase } from '@/core/usecases/DeleteProduct.usecase';

interface ProductListTableProps {
  products: ProductEntity[];
}

export default function ProductListTable({ products }: ProductListTableProps) {
  const router = useRouter();
  const productRepository = new ProductApiRepository();
  const DeleteProductUseCase = new deleteProductUsecase(productRepository);

  const handleDelete = async (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete the product "${productName}"? This action cannot be undone.`)) {
      try {
        await DeleteProductUseCase.execute(productId);
        alert(`Product "${productName}" deleted successfully!`);
        router.refresh(); // Refresh the page to show updated list
      } catch (error: any) {
        console.error('Failed to delete product:', error);
        alert(`Failed to delete product "${productName}": ${error.message}`);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (Base)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock (Total)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => {
            const firstVariation = product.variations && product.variations.length > 0 ? product.variations[0] : null;
            const mainImageUrl = firstVariation && firstVariation.images && firstVariation.images.length > 0
              ? firstVariation.images[0].url
              : 'https://placehold.co/50x50/e0e0e0/ffffff?text=N/A'; // Small placeholder

            const totalStock = product.variations?.reduce((sum, v) => sum + v.stock, 0) || 0;

            return (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-[100px]">{product.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{product.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Image
                    src={mainImageUrl}
                    alt={`${product.name} Image`}
                    width={50}
                    height={50}
                    className="object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs. {firstVariation ? firstVariation.price.toFixed(2) : 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{totalStock}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.categories.map(cat => cat.name).join(', ') || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.createdAt ? new Date(product.createdAt).toLocaleString() : 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/sxs_admin/products/${product.id}/edit`}>
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
