'use client'; // This component will likely remain client-side due to interactions or simply being part of the client bundle.

import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/button'; // Assuming this path is correct
import { HomepageEntity, TwoImageFlexSection } from '@/core/entities/HomePage.entity'; // Import relevant types

interface Props {
  homepageSection: HomepageEntity | null;
}

const CategoryPromoSection = ({ homepageSection }: Props) => {
  // Find the 'two-image-flex' section from the homepage data
  const flexSection = homepageSection?.sections?.find(
    (section): section is TwoImageFlexSection => section.type === 'two-image-flex'
  );

  
  if (!flexSection) {
   
    return null;
  }

 
  const { image1, image2 } = flexSection;

 
  const defaultImage1Url = '/images/categoryPromotion1.jpg'; 
  const defaultImage2Url = '/images/CategoryPromotion2.jpg'; 

  const img1Src = image1?.url || defaultImage1Url;
  const img1Alt = image1?.alt || 'Category Promotion 1';
  const img1Title = image1?.title || 'NEW ARRIVAL';
  const img1Subtitle = image1?.subtitle || 'DENIM';
  const img1CtaText = 'EXPLORE COLLECTION';

  const img2Src = image2?.url || defaultImage2Url;
  const img2Alt = image2?.alt || 'Category Promotion 2';
  const img2Title = image2?.title || 'GIFT CARDS';
  const img2Subtitle = image2?.subtitle || 'Help support Local business by buying a gift card\nLocal pickup Available'; // Use \n for line breaks as a string
  const img2CtaText = 'SHOP GIFT CARDS'; 

  return (
    <div className='flex justify-center mx-auto  mt-20 mb-10 space-x-3'> 
      <div className='relative flex-1 h-[400px]'> 
        <Image
          src={img1Src}
          alt={img1Alt}
          className='object-cover'
          fill
        />

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-opacity-30 p-4"> {/* Added p-4 for padding */}
          <h1 className="text-3xl md:text-5xl font-light mb-2 tracking-wide text-center">{img1Title}</h1> {/* Added text-center */}
          {img1Subtitle && <h2 className="text-3xl md:text-5xl font-serif mb-2 tracking-wide text-center">{img1Subtitle}</h2>} {/* Conditional subtitle */}
          <Button className='rounded-none bg-white text-black mt-2 hover:text-white font-bold '>{img1CtaText}</Button>
        </div>
      </div>

      {/* Right Section (Image 2) */}
      <div className='relative flex-1 h-[400px]'> 
        <Image
          src={img2Src}
          alt={img2Alt}
          className='object-cover'
          fill
        />

        {/* Overlay content */}
        <div className="absolute inset-0 flex text-center flex-col items-center justify-center text-white bg-opacity-30 p-4"> {/* Added p-4 for padding */}
          <h1 className="text-4xl md:text-5xl font-light mb-2 tracking-wide text-center">{img2Title}</h1> {/* Added text-center */}
          {img2Subtitle && (
            <p className="text-sm md:text-base mb-4">
            
              {img2Subtitle.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < img2Subtitle.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          )}
          <Button className='rounded-none bg-white text-black mt-2 hover:text-white font-bold'>{img2CtaText}</Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPromoSection;