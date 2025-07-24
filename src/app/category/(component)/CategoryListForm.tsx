// D:\Ecommerce_ogresto\stitchxstate\src\app\sxs_admin\categories\(component)\categoryListForm.tsx

import { CategoryEntity } from '@/core/entities/category.entity';
import React from 'react';
import Link from 'next/link'; // For navigation
import Image from 'next/image'; // For optimized images

interface CategoryListFormProps {
  categories: CategoryEntity[];
}

const CategoryListForm = ({ categories }: CategoryListFormProps) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-lg">
        No categories available to display.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 p-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.id}`}
          className="block group"
        >
          <div className="relative overflow-hidden  shadow-md hover:shadow-lg transition-shadow duration-300 transform group-hover:scale-105">
            <div className="w-full h-64 sm:h-72 md:h-80  lg:h-96 relative bg-gray-200 flex items-center justify-center">
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill 
                  style={{ objectFit: 'cover' }} 
                  sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 25vw" 
                  className="transition-transform  duration-300 group-hover:scale-110"
                />
              ) : (
                <span className="text-gray-500 text-sm">No Image</span>
              )}
            </div>

            {/* Category Name and Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300 flex items-end justify-center pb-4">
              <h2 className="text-white text-lg sm:text-xl font-semibold text-center px-2 z-10">
                {category.name}
              </h2>
            </div>

            {/* "Shop Now" Button Overlay (similar to the image) */}
            {/* You can add a discount percentage here if your CategoryEntity had it */}
            
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryListForm;