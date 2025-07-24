import { HomePageRepository } from "@/core/repositories/IHomePageRepository";
import { HomePageUseCases } from "@/core/usecases/HomePage.usecase";
import { HomepageEntity } from "@/core/entities/HomePage.entity";

const homepageRepository = new HomePageRepository();
const homepageUseCases = new HomePageUseCases(homepageRepository);

export const getHomePage = async (): Promise<HomepageEntity | null> => {
  try {
    return await homepageUseCases.getHomepage();
  } catch (error) {
    console.error("Error fetching homepage in getHomePage lib function:", error);
    return null;
  }
};