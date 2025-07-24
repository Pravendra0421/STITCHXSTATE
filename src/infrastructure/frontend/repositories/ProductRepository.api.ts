import { IProductRepository } from "@/core/repositories/IProductRepository";
import { ProductEntity, ProductVariationEntity } from "@/core/entities/product.entity";
import { CreateProductDTO } from "@/core/dtos/CreateProduct.dto";


export class ProductApiRepository implements IProductRepository {


  async findAll(): Promise<ProductEntity[]> {
    const response = await fetch('/api/products');

    // Check if the request was successful.
    if (!response.ok) {
      // If not, throw an error to be handled by the calling code (e.g., a component or hook).
      throw new Error('Failed to fetch products from the API.');
    }

    // Parse the JSON response from the API.
    const data = await response.json();
    return data;
  }

  /**
   * Creates a new product by sending data to the backend API.
   * @param productData - The data for the new product, conforming to CreateProductDTO.
   * @returns A promise that resolves to the newly created ProductEntity.
   */




  
  async create(productData: CreateProductDTO): Promise<ProductEntity> {
    // Make the POST request to our API endpoint.
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        // This header is crucial to inform the API that we're sending JSON data.
        'Content-Type': 'application/json',
      },
      // Serialize the JavaScript object into a JSON string for the request body.
      body: JSON.stringify(productData),
    });

    // Check if the request was successful (e.g., status 201 Created).
    if (!response.ok) {
      // Try to parse the error message sent back from our API for better feedback.
      const errorData = await response.json();
      throw new Error(errorData.message || 'An unknown error occurred while creating the product.');
    }

    // Parse the JSON response, which should be the newly created product.
    const data = await response.json();
    return data;
  }
  async findById(id: string): Promise<ProductEntity | null> {
       const response = await fetch(`http://localhost:3000/api/products/${id}`);
            if (!response.ok) {
              if (response.status === 404) return null;
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to fetch user by ID from the API.');
            }
            const data = await response.json();
            return data;
  }
  async findByCategoryId(categoryId: string): Promise<ProductEntity[]> {
      const response= await fetch(`/api/category/${categoryId}/products`);
      if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch user by ID from the API.');
      }
      const data = await response.json();
      return data;
  }
  async update(id: string, productData: CreateProductDTO): Promise<ProductEntity> {
      const response = await fetch(`/api/products/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(productData),
            });
        
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to update user.');
            }
            const updated= await response.json();
            return updated;
  }
  async delete(id: string): Promise<ProductEntity> {
       const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete user.');
    }
     const deletedProduct: ProductEntity = await response.json();
    return deletedProduct;
  }
  // Operation not supported by this API repository directly. Stock updates are handled by backend order/cart processing.
    async updateProductVariationStock(
        productVariationId: string,
        newStock: number
    ): Promise<ProductVariationEntity | null> {
        console.warn(`ProductApiRepository: updateProductVariationStock is not meant to be called directly from the frontend. This operation is handled by backend services.`);
        throw new Error("Operation not supported by this API repository directly. Stock updates are handled by backend order/cart processing.");
    }

    async findByProductVariationId(id: string): Promise<ProductEntity | null> {

        console.warn(`ProductApiRepository: findByProductVariationId is not implemented. Please check IProductRepository definition.`);
        throw new Error("Method not implemented in ProductApiRepository. Check IProductRepository for correct methods.");
    }
}

