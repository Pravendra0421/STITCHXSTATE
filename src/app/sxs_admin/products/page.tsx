// src/app/sxs_admin/products/page.tsx
// This is a Server Component, so no 'use client'

import Link from 'next/link';
import { ProductRepository } from '@/core/repositories/IProductRepository';// Your concrete backend ProductRepository
import { GetAllProductsUseCase } from '@/core/usecases/GetAllProducts.usecase'; 
import ProductListTable from './(_component)/ProductListTable';
import { ProductEntity } from '@/core/entities/product.entity';

export default async function AdminProductListPage() {
  const productRepository = new ProductRepository();
  const getAllProductsUseCase = new GetAllProductsUseCase(productRepository);

  let products : ProductEntity[] = [];
  let error: string | null = null;

  try {
    products = await getAllProductsUseCase.execute();
  } catch (err) {
    error = 'Failed to load products.';
  }

  return (
    <div className="container w-full p-6 bg-white shadow-md rounded-lg  overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Product Management</h1>

      <div className="flex justify-end mb-4">
        <Link href="/sxs_admin/products/add">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out">
            Add New Product
          </button>
        </Link>
      </div>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-lg">
          No products found. Add a new product to get started!
        </div>
      ) : (
        <ProductListTable products={products} />
      )}
    </div>
  );
}
