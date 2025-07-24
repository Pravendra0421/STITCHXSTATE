import { ProductEntity } from "../entities/product.entity";
import { IProductRepository } from "../repositories/IProductRepository";
import { CreateProductDTO } from "../dtos/CreateProduct.dto";

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(productData: CreateProductDTO): Promise<ProductEntity> {
    // Here you could add business validation logic.
    // For example, check if a product with the same name already exists,
    // ensure price is not negative, etc.
    if (!productData.variations || productData.variations.length === 0) {
      throw new Error("A product must have at least one variation.");
    }

    // If validation passes, call the repository to create the product.
    const newProduct = await this.productRepository.create(productData);
    
    return newProduct;
  }
}