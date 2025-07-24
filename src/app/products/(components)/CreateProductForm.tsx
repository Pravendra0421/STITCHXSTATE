'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- Import the router

import { CreateProductDTO } from '@/core/dtos/CreateProduct.dto';
import { CreateProductUseCase } from '@/core/usecases/CreateProduct.usecase';
import { ProductApiRepository } from '@/infrastructure/frontend/repositories/ProductRepository.api';

// No more onProductCreated prop
export function CreateProductForm() {
  const router = useRouter(); // <-- Get the router instance
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    const productData: CreateProductDTO = {
      // ... (same product data as before)
      name,
      description: 'A default description from the form.',
      categoryIds: ['1'],
      variations: [{ size: 'S', color: 'Black', price: 999.99, stock: 100, images: [] }],
    };
    try {
      // The logic for calling the API remains the same
      const productRepository = new ProductApiRepository();
      const createProduct = new CreateProductUseCase(productRepository);
      await createProduct.execute(productData);

      alert('Product created successfully!');
      setName('');
      
      // --- THE MODERN WAY TO REFRESH SERVER DATA ---
      // This tells Next.js to re-fetch the data for the current route
      // on the server and update the UI without a full page reload.
      router.refresh();
      // ---
      

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSubmitting(false);
    }
  };
  
  // The rest of the form JSX remains the same
  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded shadow-md">
      {/* ... form inputs and button ... */}
      <h2 className="text-2xl font-bold mb-4">Create New Product</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block font-semibold mb-1">Product Name</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" required />
      </div>
      <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400">
        {submitting ? 'Submitting...' : 'Create Product'}
      </button>
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
    </form>
  );
}