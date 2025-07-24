// This can be a Server Component too, as it has no client-side interactivity.
// No 'use client' is needed.
import { ProductEntity } from '@/core/entities/product.entity';

// It now receives the initial products as a prop
interface ProductListProps {
  initialProducts: ProductEntity[];
}

export function ProductList({ initialProducts }: ProductListProps) {
  // No more useState, useEffect, loading, or error states!
  
  if (initialProducts.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold my-4">Product List</h2>
      <ul>
        {initialProducts.map((product) => (
          <li key={product.id} className="mb-2 p-2 border rounded">
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm text-gray-600">{product.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}