'use client';

import React from 'react';
import Link from 'next/link';
import CategoryListForm from '@/app/category/(component)/CategoryListForm';
import { CategoryEntity } from '@/core/entities/category.entity';
import { Button } from '../ui/button'
interface Props {
  categories: CategoryEntity[];
}

export default function Category({ categories }: Props) {
  return (
    <section className="px-4 py-8 text-center">
        <h2 className="text-4xl  font-serif text-center "style={{ color: '#5B4B43' }}>SHOP BY CATEGORY</h2>
      

      <CategoryListForm categories={categories} />
      <h2 className="text-4xl  text-center mt-10 "style={{ color: '#5B4B43' }}>FROM THE JOURNAL</h2>
      <Link
          href="/category"
        >
            <Button className='rounded-none mt-5' >
          View all
          </Button>
        </Link>
    </section>
  );
}
