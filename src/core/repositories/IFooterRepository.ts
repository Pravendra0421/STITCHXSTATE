import { FooterEntity,FooterSection } from "../entities/Footer.entity";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { UpdateFooterDto } from "../dtos/Footer.dto";
export interface IFooterRepository{
    getFooter():Promise<FooterSection |null>;
    updateFooter(data:UpdateFooterDto):Promise<FooterSection | null>;
}
type PrismaFooter = Prisma.FooterGetPayload<{}>

export class FooterRepository implements IFooterRepository{
    private mapPrismaFooter(prismaFooter:PrismaFooter):FooterSection{
        return{
            id:prismaFooter.id,
            sections:prismaFooter.sections as unknown as FooterEntity[],
            createdAt:prismaFooter.createdAt,
            updatedAt:prismaFooter.updatedAt
        }
    }

    async getFooter(): Promise<FooterSection | null> {
        let footerRecord:PrismaFooter |null;
        try {
            footerRecord= await prisma.footer.findFirst();
            if(!footerRecord){
                console.log("No Footer content found — creating a default empty record.");
                footerRecord = await prisma.footer.create({
                    data:{
                        sections:[],
                    }
                })
                console.log("Default footer  record created successfully.");
            }
        } catch (error) {
            console.error("Error fetching or creating footer content:", error);
            return null;
        }
        return this.mapPrismaFooter(footerRecord);
    }

    async updateFooter(data:UpdateFooterDto): Promise<FooterSection | null> {
        const existingFooter = await this.getFooter();
        if(!existingFooter){
            throw new Error("Failed to retrieve or create footer record for update operation.");
        }
        try {
            const updateFooter = await prisma.footer.update({
                where:{id:existingFooter.id},
                data:{
                    sections:JSON.parse(JSON.stringify(data.sections))
                }
            });
            return this.mapPrismaFooter(updateFooter)
        } catch (error) {
             console.error(`Error updating footer content with ID ${existingFooter.id}:`, error);
            throw new Error(`Failed to update footer content: ${(error as Error).message || 'An unknown error occurred.'}`);
        }
    }
}