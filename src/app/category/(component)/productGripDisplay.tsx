'use client';

import { ProductEntity } from '@/core/entities/product.entity';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ProductGridDisplayProps {
  products: ProductEntity[];
}

/** Return a comma‑separated list of unique sizes from all variations */
const getAvailableSizes = (product: ProductEntity): string => {
  if (!product.variations?.length) return 'N/A';
  const sizes = Array.from(new Set(product.variations.map(v => v.size)));
  return sizes.join(', ');
};

/** Calculate percentage off (rounded) */
const getDiscountPercent = (price: number, salePrice: number) =>
  Math.max(0, Math.round(((price - salePrice) / price) * 100));

export default function ProductGridDisplay({ products }: ProductGridDisplayProps) {
  if (!products?.length) {
    return (
      <div className="text-center py-8 text-gray-500 text-lg">
        No products available to display in this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {products.map((product) => {
        // 👇— grab the first variation as your “display” variant
        const variation = product.variations?.[0];
        const gallery = product.galleryImages?.[0];
        const mainImageUrl =
          variation?.images?.[0]?.url ??
          'https://placehold.co/400x600/e0e0e0/ffffff?text=No+Image';

        const price = variation?.price ?? 0;
        const salePrice = variation?.salePrice ?? 0;          // 👈 NEW
        const hasSale = salePrice > 0 && salePrice < price;   // 👈 NEW
        const discount = hasSale ? getDiscountPercent(price, salePrice) : 0;

        const availableSizes = getAvailableSizes(product);

        return (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="block group relative bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* ---------- Image block ---------- */}
            <div className="relative w-full h-80 bg-gray-100 flex items-center justify-center overflow-hidden">
              <Image
                src={mainImageUrl}
                alt={product.name}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width:640px)100vw,(max-width:768px)50vw,(max-width:1024px)33vw,25vw"
                className="transition-transform duration-300 group-hover:scale-105"
              />

              {/* Wishlist button */}
              <button
                type="button"
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-gray-700 hover:text-red-500 hover:scale-110 transition-transform duration-200 z-10"
                aria-label="Add to wishlist"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Wishlist functionality coming soon!');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </button>

              {/* 👇— Discount badge (only when on sale) */}
              {hasSale && (
                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded z-10 shadow">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* ---------- Info block ---------- */}
            <div className="p-4 bg-white">
              <p className="text-sm text-gray-500 mb-1">Anouk</p> {/* example brand */}
              <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
                {product.name}
              </h3>

              {/* Sizes */}
              <p className="text-xs text-gray-600 mt-2">Sizes: {availableSizes}</p>

              {/* ---------- Price ---------- */}
              <div className="flex items-baseline mt-2 gap-2">
                {hasSale ? (
                  <>
                    <span className="text-lg font-bold text-red-600">
                      Rs. {salePrice.toFixed(0)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      Rs. {price.toFixed(0)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-900">
                    Rs. {price.toFixed(0)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
