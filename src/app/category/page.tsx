import { CategoryEntity } from "@/core/entities/category.entity";
import { CategoryRepository } from "@/core/repositories/ICategoryRepository";
import { GetAllCategoriesUseCase } from "@/core/usecases/GetAllCategory.usecase";
import CategoryListForm from "./(component)/CategoryListForm";
export default async function CategoryListPage(){
    const categoryRepository = new CategoryRepository();
    const getAllcategoriesUseCase = new GetAllCategoriesUseCase(categoryRepository);
    let categories:CategoryEntity[]=[];
    try {
        categories=await getAllcategoriesUseCase.execute();
    } catch (err) {
        console.error("Error fetching categories:", err); 
    }

    return(
        <div className="text-center mt-10">
            <div className="text-6xl font-bold mb-10">SHOP BY CATEGORY</div>
            <CategoryListForm categories={categories}/>
        </div>    

    )
}