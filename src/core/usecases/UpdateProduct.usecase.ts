import { IProductRepository } from "../repositories/IProductRepository";
import { CreateProductDTO } from "../dtos/CreateProduct.dto";
import { ProductEntity } from "../entities/product.entity";
export class UpdateProductUseCase {
    constructor(private productRepository: IProductRepository) {}

    async execute(id: string, productData: CreateProductDTO): Promise<ProductEntity> {
        if (Object.keys(productData).length === 0) {
            throw { message: 'No data provided for product update.', code: 'NO_UPDATE_DATA' };
        }

        try {
            const existingProduct = await this.productRepository.findById(id); 
            if (!existingProduct) {
                throw { message: 'Product not found for update.', code: 'NOT_FOUND' };
            }

            const updatedProduct = await this.productRepository.update(id, productData); 
            return updatedProduct;
        } catch (error) {
            console.error(`Error in ProductUseCases.updateProduct for ID ${id}:`, error);
            throw error;
        }
    }
}