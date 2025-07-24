import { ICategoryRepository } from "../repositories/ICategoryRepository";
import {  UpdateCategoryDTO } from "../dtos/CreateCategory.dto";
import { CategoryEntity } from "../entities/category.entity";

export class UpdateCategoryUseCase{
    constructor(private categoryRepository:ICategoryRepository){}
    async execute(id:string,data:UpdateCategoryDTO):Promise<CategoryEntity>{
         if (!id) {
      throw new Error('Category ID is required for update.');
    }
    if (data.name !== undefined && data.name.trim() === '') {
      throw new Error('Category name cannot be empty.');
    }
    // imageUrl is now a simple string
    if (data.imageUrl !== undefined && typeof data.imageUrl !== 'string') {
        throw new Error('Image URL must be a string.');
    }

    return this.categoryRepository.update(id, data);
  }
}