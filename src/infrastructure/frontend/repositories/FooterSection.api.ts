import { FooterSection } from "@/core/entities/Footer.entity";
import { UpdateFooterDto } from "@/core/dtos/Footer.dto";
import { IFooterRepository } from "@/core/repositories/IFooterRepository";
export class FooterSectionApiRepository implements IFooterRepository{
    async getFooter(): Promise<FooterSection | null> {
        try {
                    const response = await fetch('/api/footer',{
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
                        console.error('Failed to fetch footer content:', response.status, errorData);
                        throw new Error(errorData.message || `Failed to fetch footer content. Status: ${response.status}`);
                    }
                    const data:FooterSection = await response.json();
                    return data;
                } catch (error) {
                    console.error('Network or unexpected error during getFooter:', error);
                    throw error;
                }
    }
    async updateFooter(data: UpdateFooterDto): Promise<FooterSection | null> {
        try {
                    const response = await fetch('/api/footer',{
                        method:'PUT',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify(data),
                    });
                    if(!response.ok){
                        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
                        console.error('Failed to update footer content:', response.status, errorData);
                        throw new Error(errorData.message || `Failed to fetch footer content. Status: ${response.status}`);
                    }
                    const updateData:FooterSection = await response.json();
                    return updateData;
                } catch (error) {
                    console.error('Network or unexpected error during updateFooter:', error);
                    throw error;
                }
    }
}