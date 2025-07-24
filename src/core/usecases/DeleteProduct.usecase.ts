import { IProductRepository } from "../repositories/IProductRepository";
export class deleteProductUsecase{
    constructor(private categoryRepository:IProductRepository){}
    async execute(id:string):Promise<boolean>{
        await this.categoryRepository.delete(id);
        return true;
    }
}