import { ICategoryRepository } from "../repositories/ICategoryRepository";
import { CategoryEntity } from "../entities/category.entity";

export class getCategoryByIdUSeCase{
    constructor(private categoryRepository:ICategoryRepository){}
    async execute(id:string):Promise<CategoryEntity |null>{
        const newCategory = await this.categoryRepository.findById(id);
        return newCategory;
    }
}