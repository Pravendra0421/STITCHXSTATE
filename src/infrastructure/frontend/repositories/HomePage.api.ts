import { IHomePageRepository } from "@/core/repositories/IHomePageRepository";
import { HomepageEntity } from "@/core/entities/HomePage.entity";
import { UpdateHomepageDTO } from "@/core/dtos/HomePage.dto";

export class HomePageApiRepository implements IHomePageRepository{
    async getHomePage(): Promise<HomepageEntity | null> {
        try {
            const response = await fetch('/api/homePage',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json'
                },
                cache:'no-store'
            });
            if(response.status ===404){
                return null;
            }
            if(!response.ok){
                const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
                console.error('Failed to fetch homepage content:', response.status, errorData);
                throw new Error(errorData.message || `Failed to fetch homepage content. Status: ${response.status}`);
            }
            const data:HomepageEntity = await response.json();
            return data;
        } catch (error) {
            console.error('Network or unexpected error during getHomePage:', error);
            throw error;
        }
    }
    async updateHomepage(data: UpdateHomepageDTO): Promise<HomepageEntity> {
        try {
            const response = await fetch('/api/homePage',{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(data),
            });
            if(!response.ok){
                const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
                console.error('Failed to update homepage content:', response.status, errorData);
                throw new Error(errorData.message || `Failed to fetch homepage content. Status: ${response.status}`);
            }
            const updateData:HomepageEntity = await response.json();
            return updateData;
        } catch (error) {
            console.error('Network or unexpected error during updateHomepage:', error);
            throw error;
        }
    }
}