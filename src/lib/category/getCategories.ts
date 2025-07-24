
import { cache } from 'react';
import { CategoryRepository } from '@/core/repositories/ICategoryRepository';
import { GetAllCategoriesUseCase } from '@/core/usecases/GetAllCategory.usecase';

export const getCategories = cache(async () => {
  const repo = new CategoryRepository();
  const useCase = new GetAllCategoriesUseCase(repo);
  return await useCase.execute(); 
});
