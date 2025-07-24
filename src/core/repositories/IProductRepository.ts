// core/repositories/ProductRepository.ts
import { CreateProductDTO } from "../dtos/CreateProduct.dto";
import { ProductEntity } from "../entities/product.entity";
import { ProductVariationEntity } from "../entities/product.entity";
import prisma from "@/lib/prisma";

export interface IProductRepository {
  findAll(): Promise<ProductEntity[]>;
  create(productData: CreateProductDTO): Promise<ProductEntity>;
  findById(id:string):Promise<ProductEntity |null>;
  update(id: string, productData: CreateProductDTO): Promise<ProductEntity>;
  delete(id: string): Promise<ProductEntity>;
  findByCategoryId(categoryId: string): Promise<ProductEntity[]>;
  updateProductVariationStock(
        productVariationId: string,
        newStock: number
    ): Promise<ProductVariationEntity | null>;
    findByProductVariationId(productVariationId: string): Promise<ProductEntity | null>;
}

// Helper to map nulls to undefined for category SEO fields
function mapCategoryNullsToUndefined(cat: any) {
  const { seoTitle, seoDescription, imageUrl, ...rest } = cat;
  return {
    ...rest,
    seoTitle: seoTitle === null ? undefined : seoTitle,
    seoDescription: seoDescription === null ? undefined : seoDescription,
    imageUrl: imageUrl === null ? undefined : imageUrl,
  };
}

export class ProductRepository implements IProductRepository {
  
  async findAll(): Promise<ProductEntity[]> {
    const products = await prisma.product.findMany({
      include: {
        variations: {
          include: {
            images: true,
          },
        },
        categories: true,
        galleryImages: true,
      },
    });
    return products.map(product => ({
      ...product,
      categories: product.categories.map(mapCategoryNullsToUndefined) as import('../entities/category.entity').CategoryEntity[]
    })) as ProductEntity[];
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { 
        variations: {
          include: {
            images: true,
          },
        },
        categories: true,
        galleryImages: true, // Correctly included
      },
    });
    console.log(`ProductRepository.findById result for ${id}:`, product ? 'Found' : 'Not Found', product);
    if (!product) return null;
    return {
      ...product,
      categories: product.categories.map(mapCategoryNullsToUndefined) as import('../entities/category.entity').CategoryEntity[]
    } as ProductEntity;
  }

  async findByCategoryId(categoryId: string): Promise<ProductEntity[]> {
    const products = await prisma.product.findMany({
      where: {
        categories: {
          some: {
            id: categoryId,
          },
        },
      },
      include: { 
        categories: true,
        variations: {
          include: {
            images: true,
          },
        },
        galleryImages: true, 
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });
    return products as ProductEntity[];
  }

  async create(productData: CreateProductDTO): Promise<ProductEntity> {
    // Destructure all new fields
    const { name, description, categoryIds, variations, thumbnailVideo, galleryImages, seoTitle, seoDescription } = productData;
    
    const createData: any = {
      name,
      description,
      ...(thumbnailVideo !== undefined && thumbnailVideo !== null && { thumbnailVideo }),
      ...(seoTitle !== undefined && { seoTitle }),
      ...(seoDescription !== undefined && { seoDescription }),
    };

    if (categoryIds && categoryIds.length > 0) {
        createData.categories = {
            connect: categoryIds.map((id) => ({ id })),
        };
    }

    if (variations && variations.length > 0) {
        createData.variations = {
            create: variations.map(variation => ({
                size: variation.size,
                color: variation.color,
                price: variation.price,
                stock: variation.stock,
                salePrice: variation.salePrice ?? 0.0,
                images: {
                    create: (variation.images || []).map(image => ({ url: image.url })),
                },
            })),
        };
    }

    if (galleryImages && galleryImages.length > 0) {
        createData.galleryImages = {
            create: galleryImages.map(image => ({ url: image.url })),
        };
    }

    const newProduct = await prisma.product.create({
        data: createData,
        include: {
            variations: {
                include: {
                    images: true,
                },
            },
            categories: true,
            galleryImages: true, // Ensured galleryImages is included
        },
    });

    return newProduct;
  }

  async update(id: string, productData: CreateProductDTO): Promise<ProductEntity> {
    const { name, description, categoryIds, variations, thumbnailVideo, galleryImages, seoTitle, seoDescription } = productData;
    const updateData: any = {};

    // --- Step 1: Update the main product record (General information) ---
    // Update basic product details if they are provided in the request
    if (name !== undefined) {
        updateData.name = name;
    }
    if (description !== undefined) {
        updateData.description = description;
    }
    // Update thumbnailVideo: if provided, set it.
    if (thumbnailVideo !== undefined) {
        updateData.thumbnailVideo = thumbnailVideo;
    }
    if (seoTitle !== undefined) {
        updateData.seoTitle = seoTitle;
    }
    if (seoDescription !== undefined) {
        updateData.seoDescription = seoDescription;
    }

    // Update categories by setting a new list. This replaces all old categories.
    if (categoryIds !== undefined) {
        updateData.categories = {
            set: categoryIds.map((catId) => ({ id: catId })),
        };
    }

    // Perform the initial update on the main product record.
    await prisma.product.update({
        where: { id },
        data: updateData,
    });

    // --- Step 2: Handle product variations safely (The crucial part) ---
    if (variations !== undefined && variations !== null) {
        // Fetch the IDs of all variations currently linked to this product in the database.
        const existingVariationIds = await prisma.productVariation.findMany({
            where: { productId: id },
            select: { id: true },
        }).then(variations => variations.map(v => v.id));

        // Separate the incoming variations into two groups based on whether they have an ID.
        const variationsToCreate = variations.filter(v => !v.id); // These are brand new variations.
        const variationsToUpdate = variations.filter(v => v.id); // These already exist and need updating.

        // Create a Set of IDs from the incoming update request for quick lookup.
        const incomingVariationIds = new Set(variationsToUpdate.map(v => v.id));

        // 2a. Update existing variations
        // Loop through the variations that need to be updated.
        for (const variation of variationsToUpdate) {
            // Update the variation's fields in the database.
            await prisma.productVariation.update({
                where: { id: variation.id },
                data: {
                    size: variation.size,
                    color: variation.color,
                    price: variation.price,
                    stock: variation.stock,
                    salePrice: variation.salePrice ?? 0.0,
                    // Note: This logic assumes you are not updating images here. If you need to,
                    // you'd need a nested update for images, similar to how we handle variations.
                    images: {
                       // First, delete old images linked to this variation.
                       deleteMany: {
                         productVariationId: variation.id,
                       },
                       // Then, create new images for this variation.
                       create: (variation.images || []).map(img => ({ url: img.url })),
                     },
                },
            });
        }

        // 2b. Create new variations
        // Loop through the variations that need to be created.
        if (variationsToCreate.length > 0) {
            for (const variation of variationsToCreate) {
                 await prisma.productVariation.create({
                    data: {
                        size: variation.size,
                        color: variation.color,
                        price: variation.price,
                        stock: variation.stock,
                        salePrice: variation.salePrice ?? 0.0,
                        product: { connect: { id } },
                        images: {
                            create: (variation.images || []).map((img) => ({ url: img.url })),
                        },
                    },
                });
            }
        }
        
        // 2c. Delete removed variations
        // Find variations that are in the database but are NOT in the incoming list.
        const variationsToDelete = existingVariationIds.filter(existingId => !incomingVariationIds.has(existingId));

        if (variationsToDelete.length > 0) {
            try {
                // This is the command that can violate the foreign key constraint.
                // We wrap it in a try...catch block to prevent the entire update from failing.
                await prisma.productVariation.deleteMany({
                    where: {
                        id: { in: variationsToDelete },
                    },
                });
            } catch (error) {
                // Log the error. This means some variations could not be deleted
                // because they are referenced by another table (e.g., cart, orders).
                console.error('Error deleting product variations due to foreign key constraint:', error);
                // You can add more specific error handling here if needed.
            }
        }
    }

    // --- Step 3: Handle gallery images using a similar, safe method ---
    if (galleryImages !== undefined && galleryImages !== null) {
        // Fetch existing gallery image IDs.
        const existingImageIds = await prisma.galleryImage.findMany({
            where: { productId: id },
            select: { id: true,url:true },
        }).then(images => images.map(img => img.id));
        
        // Separate images to update and create.
        const imagesToCreate = galleryImages.filter(img => !img.url);
        const imagesToUpdate = galleryImages.filter(img => img.url);

        const incomingImageIds = new Set(imagesToUpdate.map(img => img.id));
        
        // Update existing images.
        for (const image of imagesToUpdate) {
    try {
        await prisma.galleryImage.update({
            where: { id: image.id },
            data: { url: image.url },
        });
    } catch (error) {
        console.error(`Warning: Could not update gallery image with ID ${image.id}. It might have been deleted.`, error);
    }
}
        
        // Create new images.
        if (imagesToCreate.length > 0) {
             await prisma.galleryImage.createMany({
                data: imagesToCreate.map(img => ({
                    productId: id,
                    url: img.url,
                })),
            });
        }

        // Delete images that are no longer in the list.
        const imagesToDelete = existingImageIds.filter(existingId => !incomingImageIds.has(existingId));

        if (imagesToDelete.length > 0) {
            // Gallery images likely don't have foreign key constraints, so this is safer.
            await prisma.galleryImage.deleteMany({
                where: { id: { in: imagesToDelete } },
            });
        }
    }

    // --- Step 4: Fetch and return the final updated product ---
    // Fetch the complete and updated product entity from the database with all its relations.
    const finalProduct = await prisma.product.findUnique({
        where: { id },
        include: {
            variations: {
                include: {
                    images: true,
                },
            },
            categories: true,
            galleryImages: true,
        },
    });

    return finalProduct!;
}


  async delete(id: string): Promise<ProductEntity> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variations: {
          include: {
            images: true,
          },
        },
        categories: true,
        galleryImages: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    await prisma.product.delete({
      where: { id },
    });

    return product;
  }
  async updateProductVariationStock(
        productVariationId: string,
        newStock: number
    ): Promise<ProductVariationEntity | null> {
        try {
            const updatedVariation = await prisma.productVariation.update({
                where: { id: productVariationId },
                data: { stock: newStock },
                include: { images: true }
            });
            return updatedVariation as ProductVariationEntity;
        } catch (error) {
            console.error(`Error updating product variation stock for ${productVariationId}:`, error);
            return null; 
        }
    }
    async findByProductVariationId(productVariationId: string): Promise<ProductEntity | null> {
    const product = await prisma.product.findFirst({
        where: {
            variations: {
                some: {
                    id: productVariationId,
                },
            },
        },
        include: {
            variations: true,
        },
    });
    return product as ProductEntity | null;
}
  
}