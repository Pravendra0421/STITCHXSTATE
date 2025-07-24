import { ICategoryRepository } from "../repositories/ICategoryRepository";
import { CreateCategoryDTO } from "../dtos/CreateCategory.dto";
import { CategoryEntity } from "../entities/category.entity";
export class CreateCategoryUseCase{
    constructor(private categoryRepository:ICategoryRepository){}
    async execute(data: CreateCategoryDTO): Promise<CategoryEntity> {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Category name is required.');
    }
    // imageUrl is now a simple string
    if (data.imageUrl && typeof data.imageUrl !== 'string') {
        throw new Error('Image URL must be a string.');
    }
    const newCategory = await this.categoryRepository.create(data);
    return newCategory;
  }
} 