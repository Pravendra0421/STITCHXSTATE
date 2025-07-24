import { FooterRepository } from "@/core/repositories/IFooterRepository";
import { FooterSectionUsecase } from "@/core/usecases/FooterSection.usecase";
import { FooterSection } from "@/core/entities/Footer.entity";
const footerrepository= new FooterRepository();
const footerusecase=new FooterSectionUsecase(footerrepository);

export const getFooter = async():Promise<FooterSection |null>=>{
    try {
        return await footerusecase.getFooter();
    } catch (error) {
        console.error("Error fetching homepage in getHomePage lib function:", error);
        return null;
    }
}