import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { slides } from './slideData'
import Image from 'next/image'
import { HomepageEntity,CarouselSection } from '@/core/entities/HomePage.entity';
interface Props {
  homepageSection: HomepageEntity | null;
}
const HeroBanner = ({ homepageSection }: Props) => {
  const carouselSection = homepageSection?.sections?.find(
    (section): section is CarouselSection => section.type === 'carousel'
  );
  const slidesToRender = carouselSection?.images || [];
  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      className="w-full h-[80vh] relative"
    >
      <CarouselContent>
        {slidesToRender.map((item, index) => (
          <CarouselItem key={index} className="w-full">
            <div className="relative w-full h-[80vh] overflow-hidden">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.alt}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
          </CarouselItem>
        ))}

      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
       <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
    </Carousel>
  )
}

export default HeroBanner;