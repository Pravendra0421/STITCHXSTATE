import { ICategoryRepository } from "../repositories/ICategoryRepository";
import { CategoryEntity } from "../entities/category.entity";
export class GetAllCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.findAll();
    return categories;
  }
}