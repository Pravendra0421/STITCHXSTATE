import { ICategoryRepository } from "@/core/repositories/ICategoryRepository";
import { CategoryEntity } from "@/core/entities/category.entity";
import { CreateCategoryDTO, UpdateCategoryDTO } from "@/core/dtos/CreateCategory.dto";

export class CategoryApiRepository implements ICategoryRepository{
    async findAll(): Promise<CategoryEntity[]> {
        const response = await fetch('/api//category')
        if(!response.ok){
            const errorData = await  response.json();
            throw new Error(errorData.message )
        }
        const data= await response.json();
        return data;
    }

    async create(categoryData: CreateCategoryDTO): Promise<CategoryEntity> {
        const response = await fetch('/api/category',{
            method:'POST',
            headers:{
                'content-Type':'application/json',
            },
            body:JSON.stringify(categoryData)
        });
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create category via API.');
        }
        const data = await response.json();
        return data;
    }
    async findById(id: string): Promise<CategoryEntity | null> {
         const response = await fetch(`/api/category/${id}`);
            if (!response.ok) {
              if (response.status === 404) return null;
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to fetch user by ID from the API.');
            }
            const data = await response.json();
            return data;
    }
    async update(id: string, categoryData: UpdateCategoryDTO): Promise<CategoryEntity> {
        const response = await fetch(`/api/category/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(categoryData),
            });
        
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to update user.');
            }
            const updatedUser= await response.json();
            return updatedUser;
    }
    async delete(id: string): Promise<void> {
        const response = await fetch(`/api/category/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete user.');
    }
    }
}