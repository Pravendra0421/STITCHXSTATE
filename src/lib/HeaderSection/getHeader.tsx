import { HeaderRepository } from "@/core/repositories/IHeaderRepository";
import { HeaderSectionUseCases } from "@/core/usecases/HeaderSection.usecase";
import { HeaderSection } from "@/core/entities/Header.entity";

const headerRepository= new HeaderRepository();
const headerUseCases= new HeaderSectionUseCases(headerRepository);
export const getHeader =async():Promise<HeaderSection |null>=>{
    try {
        return await headerUseCases.getHeader();
    } catch (error) {
        console.error("Error fetching homepage in getHomePage lib function:", error);
        return null;
    }
}