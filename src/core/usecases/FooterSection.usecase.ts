import { IFooterRepository } from "../repositories/IFooterRepository";
import { FooterSection } from "../entities/Footer.entity";
import { UpdateFooterDto } from "../dtos/Footer.dto";
export class FooterSectionUsecase{
    constructor(private FooterRepository:IFooterRepository){}
    async getFooter():Promise<FooterSection |null>{
        const footer= await this.FooterRepository.getFooter();
        if(footer){
            console.log("footerUSecaes: footerSection content retrieved successfully.");
        }
        else{
            console.log("footerUSecaes: No footerSection content found or an error occurred during retrieval/creation.");
        }
        return footer;
    }
    async updateFooter(data:UpdateFooterDto):Promise<FooterSection | null>{
        const updatefooter = await this.FooterRepository.updateFooter(data)
        console.log("footerUSecaes: footerSection content updated successfully.")
        return updatefooter;
    }
}