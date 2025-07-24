import HeroBanner from '@/components/widget/HeroBanner'
import React from 'react'
import BlackFridayHero from '@/components/widget/BlackFridayHero'
import CategoryPromoSection from '@/components/widget/CategoryPromoSection'
import EssentialHero from '@/components/widget/EssentialHero'
import Essential2 from '../components/widget/Essential2'
import Look from '@/components/widget/Look'
import Category from '@/components/widget/Category'
import { getCategories } from '@/lib/category/getCategories'
import { getHomePage } from '@/lib/HomePageSection/getHomePage';
import Products from '@/components/widget/Products'
import { ProductRepository } from '@/core/repositories/IProductRepository'
import { GetAllProductsUseCase } from '@/core/usecases/GetAllProducts.usecase';
import { ProductEntity } from '@/core/entities/product.entity'
import { Metadata } from 'next';

const Hero =async () => {

  const productRepository = new ProductRepository();
  const productUsecase = new GetAllProductsUseCase(productRepository);
  let data:ProductEntity[]=[];
  try {
    data = await productUsecase.execute();
  } catch (error) {
    console.log(error);
  }
  const categories = await getCategories();
  const homepageContent = await getHomePage();
  if (!homepageContent) {
    return <div className="text-center py-10">Failed to load homepage content.</div>;
  }
  return (
    <div>
        <HeroBanner homepageSection={homepageContent} />

        <div className='w-[75%] mx-auto'>
          <Products products={data.slice(0,8)}/>
          <BlackFridayHero homepageSection={homepageContent} />
          <CategoryPromoSection homepageSection={homepageContent} />
          <EssentialHero homepageSection={homepageContent} />
          <Look homepageSection={homepageContent} />
          <Category categories={categories.slice(0,4)}/>
          <Essential2 homepageSection={homepageContent}/>
      </div>
    </div>
  )
}

export default Hero

export async function generateMetadata(): Promise<Metadata> {
  const homepageContent = await getHomePage();
  return {
    title: homepageContent?.seoTitle || 'Home | Your Store',
    description: homepageContent?.seoDescription || 'Welcome to our ecommerce store. Discover the latest products and deals!'
  };
}