import { HeaderEntity, HeaderSection } from "../entities/Header.entity";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { UpdateHeaderDTO } from "../dtos/Header.dto";
export interface IHeaderRepository{
    getHeader():Promise<HeaderSection |null>;
    updateHeader(data:UpdateHeaderDTO):Promise<HeaderSection | null>;
}
type PrismaHeader = Prisma.HeaderGetPayload<{}>

export class HeaderRepository implements IHeaderRepository{
    private mapPrismaHeader(prismaHeader:PrismaHeader):HeaderSection{
        return{
            id:prismaHeader.id,
            sections:prismaHeader.sections as unknown as HeaderEntity[],
            createdAt:prismaHeader.createdAt,
            updatedAt:prismaHeader.updatedAt
        }
    }

   async getHeader(): Promise<HeaderSection | null> {
    let HeaderRecord: PrismaHeader | null;
    try {
        HeaderRecord = await prisma.header.findFirst();
        if (!HeaderRecord) {
            console.log("No header content found — creating a default empty record.");
            HeaderRecord = await prisma.header.create({
                data: {
                    sections: [],
                }
            });
            console.log("Default header record created successfully.");
        }
    } catch (error) {
        console.error("Error fetching or creating header content:", error);
        return null;
    }
    return this.mapPrismaHeader(HeaderRecord);
}

    async updateHeader(data:UpdateHeaderDTO): Promise<HeaderSection | null> {
        const existingHeader = await this.getHeader();
        if (!existingHeader) {
        throw new Error("Failed to retrieve or create homepage record for update operation.");
        }
        try {
            const updateHeader = await prisma.header.update({
                where:{id:existingHeader.id},
                data:{
                    sections: JSON.parse(JSON.stringify(data.sections)) 
                }
            });
            return this.mapPrismaHeader(updateHeader);
        } catch (error) {
            console.error(`Error updating header content with ID ${existingHeader.id}:`, error);
            throw new Error(`Failed to update header content: ${(error as Error).message || 'An unknown error occurred.'}`);
        }
    }
}