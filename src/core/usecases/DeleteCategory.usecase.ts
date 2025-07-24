import { ICategoryRepository } from "../repositories/ICategoryRepository";
export class deleteCategoryUsecase{
    constructor(private categoryRepository:ICategoryRepository){}
    async execute(id:string):Promise<boolean>{
        await this.categoryRepository.delete(id);
        return true;
    }
}