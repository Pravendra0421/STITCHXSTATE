import HeroImage1 from "../../../public/images/HeroImage1.jpg"
import HeroImage2 from "../../../public/images/HeroImage2.jpg"
import HeroImage3 from "../../../public/images/Ethnic.webp"
export interface CarouselSlide {
  id: number;
  imageUrl: any;
  altText: string;
}

export const slides: CarouselSlide[] = [
  {
    id: 1,
    imageUrl: HeroImage3,
    altText: 'First slide content',
  },
  {
    id: 2,
    imageUrl: HeroImage2,
    altText: 'Second slide content',
  },
  {
    id: 3,
    imageUrl: HeroImage1,
    altText: 'Third slide content',
  },
];
