import { IProductRepository } from "../repositories/IProductRepository";
import { ProductEntity } from "../entities/product.entity";
export class getProductByIdUSeCase{
    constructor(private categoryRepository:IProductRepository){}
    async execute(id:string):Promise<ProductEntity |null>{
        const newCategory = await this.categoryRepository.findById(id);
        return newCategory;
    }
}