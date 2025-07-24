import { IHeaderRepository } from "../repositories/IHeaderRepository";
import { HeaderSection } from "../entities/Header.entity";
import { UpdateHeaderDTO } from "../dtos/Header.dto";
export class HeaderSectionUseCases{
    constructor(private HeaderRepository:IHeaderRepository){}
    async getHeader():Promise<HeaderSection | null>{
        const header=await this.HeaderRepository.getHeader();
        if (header) {
      console.log("headerUSecaes: headerSection content retrieved successfully.");
    } else {
      console.log("headerUSecaes: No headerSection content found or an error occurred during retrieval/creation.");
    }
    return header;
    }

    async updateHeader(data:UpdateHeaderDTO):Promise<HeaderSection | null>{
        const updatedHeader = await this.HeaderRepository.updateHeader(data)
        console.log("headerUSecaes: headerSection content updated successfully.");
        return updatedHeader;
    }
}