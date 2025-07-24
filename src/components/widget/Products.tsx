import React from 'react'
import { ProductEntity } from '@/core/entities/product.entity';
import Link from 'next/link';
import ProductGridDisplay from '@/app/category/(component)/productGripDisplay';
import { Button } from '../ui/button';
interface Props{
    products:ProductEntity[];
}
const Products = ({products}:Props) => {
  return (
    <div className='px-4 py-8 text-center'>
        <ProductGridDisplay products={products}/>
        <Link
        href={'/products'}>
            <Button className='rounded-none mt-2'>view All</Button>
        </Link>
    </div>
  )
}

export default Products;