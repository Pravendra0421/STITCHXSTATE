'use client'

import React from 'react';
import Image from 'next/image';
import { HomepageEntity, Look as LookSectionType } from '@/core/entities/HomePage.entity'; // Import Look as LookSectionType to avoid name collision
import Look2 from "../../../public/images/look2.avif"
interface Props {
  homepageSection: HomepageEntity | null;
}

const Look = ({ homepageSection }: Props) => {
  // Find the 'look' section from the homepage data
  const lookSection = homepageSection?.sections?.find(
    (section): section is LookSectionType => section.type === 'look'
  );

  if (!lookSection) {
    return null; 
  }

  const imageUrl = lookSection.imageUrl || "/images/look1.png"; 
  const imageAlt = lookSection.imageAlt || "Model wearing the look";
  const titleText = lookSection.title || "SHOP THE LOOK";

  return (
    <div className='flex flex-col md:flex-row mx-auto bg-white overflow-hidden my-8 min-h-[400px]'>

      <div className='w-full p-4 md:p-0 flex flex-col'>
        <h2 className='text-xl font-serif text-gray-800 p-4 pb-0 md:pl-8' style={{ color: '#5B4B43' }}>
          {titleText}
        </h2>
        
        <div className='flex justify-center items-center overflow-hidden w-full' style={{ height: '700px' }}> 
          <Image
            src={imageUrl} 
            alt={imageAlt} 
            className="w-full h-full object-cover" 
            priority
            width={700} 
            height={600}
          />
        </div>
      </div>
      <div className='w-full md:w-1/4 p-4 md:p-8 flex flex-col items-center justify-center '>
        <div className='flex flex-col items-center text-center'>
          <div className='flex justify-center items-center overflow-hidden mb-4 rounded-md' style={{ width: '200px', height: '400px' }}> {/* Explicit dimensions for the container */}
            <Image
              src={Look2} 
              alt="Rosewood DLMN Knotted High-Low Top"
              width={300} 
              height={400} 
              objectFit="contain" 
              className="w-full h-full" 
            />
          </div>

          <h3 className='text-base font-medium text-gray-700 leading-tight mb-1' style={{ color: '#5B4B43' }}>
            Rosewood DLMN Knotted High-Low Top
          </h3>
          {/* Product Price */}
          <p className='text-lg font-bold text-gray-900' style={{ color: '#5B4B43' }}>
            $46
          </p>
        </div>
      </div>
    </div>
  );
};

export default Look;



 