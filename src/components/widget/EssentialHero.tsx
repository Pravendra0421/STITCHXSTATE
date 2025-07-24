import React from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { HomepageEntity, PromoGrid} from '@/core/entities/HomePage.entity'; 
interface Props {
  homepageSection: HomepageEntity | null;
}
const EssentialHero = ({ homepageSection }: Props) => {
    const promogrid= homepageSection?.sections.find(
        (section): section is PromoGrid =>section.type ==='promo-grid'
    )
    if (!promogrid) {
 
    return null;
  }
  const {promoLeft,promoRight}=promogrid;
  const defaultImage1Url = 'stitchxstate\public\images\Essential2_image1.jpg';
  const defaultImage2Url = 'stitchxstate\public\images\Essential2_image1.jpg';
  const defaultImage3Url = 'stitchxstate\public\images\Essential2_image1.jpg';
  const defaultImage4Url = 'stitchxstate\public\images\Essential2_image1.jpg';
  const defaultImage5Url = 'stitchxstate\public\images\capusule.png';
  const pretitle=promogrid.pretitle ||"Fashion inspired by where we're from - the sunny shores of California.Products provided by PIKO"
  const mainImage =promogrid.imageUrl || defaultImage5Url;
  const title = promogrid.title || "ESSENTIALS"
  const subtitle =promogrid.subtitle ||"B&W CAPSULE"
  const description= promogrid.description ||"Get the perfact look for your fall classic wardobe";
  const promoleftpercentage=promoLeft.percentageText || "50%";
  const promoleftimg1 =promoLeft.image1Url ||defaultImage1Url;
  const promoleftalt1=promoLeft.image1Alt || "promo-grid";
  const promoleftimg2=promoLeft.image2Url ||defaultImage2Url;
  const promoleftalt2=promoLeft.image2Alt || "promo-grid-left";
  const promoRightimg1=promoRight.image1Url || defaultImage3Url;
  const promoRightimg2=promoRight.image2Url || defaultImage4Url;
  const promoRightalt1=promoRight.image1Alt || "promogrid";
  const promoRightalt2=promoRight.image2Alt || "promogrid";
  const prmoRightpercentage = promoRight.percentageText ||"25%"
  return (
        <div className='text-center mt-10'>
            <h1 className='text-[#5B4B43]'>{pretitle}
            </h1>
            <div className='relative  h-[400px] mx-auto mt-10 mb-5 text-center text'>
                <Image
                src={mainImage}
                alt='Black Friday Image'
                fill
                className='object-cover '
                priority
            />
            {/* overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white  bg-opacity-30">
                <h6 className='font-thin text-gray-300'>{title}</h6>
                <h1 className="text-3xl md:text-5xl font-extralight mb-2 tracking-wide">{subtitle}</h1>
                <p className='font-thin text-xs'>{description}</p>
                <Button className='bg-white text-black hover:text-white rounded-none mt-3 font-bold'>SHOP ALL</Button>

            </div>
            </div>
            <div className='mt-3 flex  '>
                {/* left section */}
               <div className='bg-gray-100 W-[49%] md:w-[49%] flex flex-col md:flex-row h-72'> {/* Added responsiveness */}
                    {/* Left section for text */}
                    <div className='flex flex-col justify-center items-center p-4 w-full md:w-1/2 text-center'>
                        <h4 className='text-xl font-serif text-gray-800' style={{ color: '#5B4B43' }}>UP TO</h4> 
                        <h6 className='text-6xl font-bold my-2' style={{ color: '#5B4B43' }}>{promoleftpercentage}</h6> 
                        <p className='text-sm tracking-wider text-gray-700' style={{ color: '#5B4B43' }}>OFF SELECT PRODUCTS</p> 
                    </div>

                    {/* Right section for images */}
                    <div className='flex justify-center items-center w-full md:w-1/2 '> 
                        <Image
                        src={promoleftimg1}
                        alt={promoleftalt1}
                        width={200}
                        height={200} 
                        objectFit="contain"
                        className='overflow-hidden'
                        />
                        <Image
                        src={promoleftimg2}
                        alt={promoleftalt2}
                        width={200} 
                        height={200} 
                        objectFit="contain"
                        className='overflow-hidden'
                        />
                    </div>
                </div>
                {/* right section */}
                <div className='bg-gray-100 W-[49%] md:w-[49%] flex ml-6 flex-col md:flex-row h-72'> {/* Added responsiveness */}
                    {/* Left section for text */}
                    <div className='flex flex-col justify-center items-center p-4 w-full md:w-1/2 text-center'>
                        <h4 className='text-xl font-serif text-gray-800' style={{ color: '#5B4B43' }}>UP TO</h4> 
                        <h6 className='text-6xl font-bold my-2' style={{ color: '#5B4B43' }}>{prmoRightpercentage}</h6> 
                        <p className='text-sm tracking-wider text-gray-700' style={{ color: '#5B4B43' }}>OFF SELECT PRODUCTS</p> 
                    </div>

                    {/* Right section for images */}
                    <div className='flex justify-center items-center w-full md:w-1/2 '> 
                        <Image
                        src={promoRightimg1}
                        alt={promoRightalt1}
                        width={200}
                        height={200} 
                        objectFit="contain"
                        className='overflow-hidden'
                        />
                        <Image
                        src={promoRightimg2}
                        alt={promoRightalt2}
                        width={200} 
                        height={200} 
                        objectFit="contain"
                        className='overflow-hidden'
                        />
                    </div>
                </div>
            </div>
        </div>
  )
}

export default EssentialHero;   