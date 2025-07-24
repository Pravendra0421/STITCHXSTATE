import { CartItemEntity } from "./cart.entity";
import { CategoryEntity } from "./category.entity"; 
export interface ProductImageEntity {
  id: string;
  url: string;
  productVariationId?: string;
  createdAt?: Date; 
}
export interface GalleryImageEntity {
  id: string;
  url: string;
  productId?: string; 
  createdAt?: Date;
}

export interface ProductVariationEntity {
  id: string;
  productId?: string;
  size: string;
  color: string;
  price: number;
  salePrice: number;
  stock: number;
  createdAt?: Date; 
  updatedAt?: Date; 
  images: ProductImageEntity[];
}

export interface ProductEntity {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  variations: ProductVariationEntity[];
  categories: CategoryEntity[];
  thumbnailVideo: string | null; 
  galleryImages: GalleryImageEntity[]; 
  cartItems?:CartItemEntity[]
  seoTitle?: string | null;
  seoDescription?: string | null;
}