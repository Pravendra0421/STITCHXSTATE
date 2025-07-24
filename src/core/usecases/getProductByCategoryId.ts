import { IProductRepository } from '@/core/repositories/IProductRepository';
import { ProductEntity } from '@/core/entities/product.entity';

export class GetProductsByCategoryUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(categoryId: string): Promise<ProductEntity[]> {
    return this.productRepository.findByCategoryId(categoryId);
  }
}