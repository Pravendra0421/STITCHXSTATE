// export interface CategoryImageEntity {
//   id: string;
//   url: string;
// }

// export interface CategoryEntity {
//   id: string;
//   name: string;
//   images: CategoryImageEntity[];
//   createdAt: Date; // Add createdAt if it's in your Prisma schema and you want it in the entity
//   // You might add other fields here, e.g., 'parentCategoryId: string | null;' for nesting
// }

export interface CategoryEntity {
  id: string;
  name: string;
  createdAt: Date;
  imageUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}