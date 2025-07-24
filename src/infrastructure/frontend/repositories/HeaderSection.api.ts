import { IHeaderRepository } from "@/core/repositories/IHeaderRepository";
import { HeaderSection } from "@/core/entities/Header.entity";
import { UpdateHeaderDTO } from "@/core/dtos/Header.dto";
export class HeaderSectionApiRepository implements IHeaderRepository{
    async getHeader(): Promise<HeaderSection | null> {
        try {
            const response = await fetch('/api/header',{
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
                console.error('Failed to fetch header content:', response.status, errorData);
                throw new Error(errorData.message || `Failed to fetch header content. Status: ${response.status}`);
            }
            const data:HeaderSection = await response.json();
            return data;
        } catch (error) {
            console.error('Network or unexpected error during getHeader:', error);
            throw error;
        }
    }
    async updateHeader(data: UpdateHeaderDTO): Promise<HeaderSection> {
        try {
            const response = await fetch('/api/header',{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(data),
            });
            if(!response.ok){
                const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
                console.error('Failed to update header content:', response.status, errorData);
                throw new Error(errorData.message || `Failed to fetch header content. Status: ${response.status}`);
            }
            const updateData:HeaderSection = await response.json();
            return updateData;
        } catch (error) {
            console.error('Network or unexpected error during updateHeader:', error);
            throw error;
        }
    }
}