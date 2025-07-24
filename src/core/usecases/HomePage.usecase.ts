import { IHomePageRepository } from "../repositories/IHomePageRepository";
import { HomepageEntity } from "../entities/HomePage.entity";
import { UpdateHomepageDTO } from "../dtos/HomePage.dto";

export class HomePageUseCases{
    constructor(private homepageRepository:IHomePageRepository){}
    async getHomepage():Promise<HomepageEntity |null>{
        const homepage = await this.homepageRepository.getHomePage();
    if (homepage) {
      console.log("HomePageUseCases: Homepage content retrieved successfully.");
    } else {
      console.log("HomePageUseCases: No homepage content found or an error occurred during retrieval/creation.");
    }
    return homepage;
    }
    async updateHomePage(data:UpdateHomepageDTO):Promise<HomepageEntity>{
        const updatedHomepage = await this.homepageRepository.updateHomepage(data);
        console.log("HomePageUseCases: Homepage content updated successfully.");
        return updatedHomepage;
    }
}