// This defines the data structure for creating a new product.
// It's a subset of the main ProductEntity.
export interface ImageDTO {
  id?: string; // Yeh field optional hai. New images ke liye 'id' nahi hoga, existing images ke liye hoga.
  url: string;
}
export interface CreateProductVariationDTO {
  id?:string,
  size: string;
  color: string;
  price: number;
  stock: number;
  salePrice?:number;
  images: ImageDTO[];
}

export interface CreateProductDTO {
  name?: string;
  description?: string;
  categoryIds?: string[];
  variations?: CreateProductVariationDTO[] | null;
  thumbnailVideo?: string | null;
  galleryImages?: ImageDTO[] | null; 
  seoTitle?: string;
  seoDescription?: string;
}