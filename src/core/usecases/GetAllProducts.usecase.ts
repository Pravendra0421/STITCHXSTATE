import { ProductEntity } from "../entities/product.entity";
import { IProductRepository } from "../repositories/IProductRepository";

// This use case is clean. It has no knowledge of Prisma or Next.js.
// It only depends on the abstractions (interfaces) from its own layer or inner layers.
export class GetAllProductsUseCase {
  // We use Dependency Injection to provide the repository.
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<ProductEntity[]> {
    const products = await this.productRepository.findAll();
    
    // You could add more business logic here if needed.
    // For example: filtering out products that are out of stock, etc.
    
    return products;
  }
}