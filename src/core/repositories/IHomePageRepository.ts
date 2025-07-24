// src/core/repositories/IHomePageRepository.ts
import { HomepageEntity } from "../entities/HomePage.entity";
import { UpdateHomepageDTO } from "../dtos/HomePage.dto";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { HomePageSection } from "../entities/HomePage.entity";
export interface IHomePageRepository {
  getHomePage(): Promise<HomepageEntity | null>;
  updateHomepage(data: UpdateHomepageDTO): Promise<HomepageEntity>;
}


type PrismaHomePage = Prisma.HomePageGetPayload<{}>;


export class HomePageRepository implements IHomePageRepository {
  private mapPrismaHomePageToHomePageEntity(prismaHomePage: PrismaHomePage): HomepageEntity {
    return {
      id: prismaHomePage.id,
      sections: prismaHomePage.sections as unknown as HomePageSection[],
      createdAt: prismaHomePage.createdAt,
      updatedAt: prismaHomePage.updatedAt,
      seoTitle: prismaHomePage.seoTitle ?? '',
      seoDescription: prismaHomePage.seoDescription ?? '',
    };
  }

  async getHomePage(): Promise<HomepageEntity | null> {
    let homePageRecord: PrismaHomePage | null;
    try {
      homePageRecord = await prisma.homePage.findFirst();

      if (!homePageRecord) {
        console.log("No homepage content found, creating a default empty record.");
        homePageRecord = await prisma.homePage.create({
          data: {
            sections: [], // This is a valid JsonArray
            seoTitle: '',
            seoDescription: '',
          },
        });
        console.log("Default homepage record created successfully.");
      }
    } catch (error) {
      console.error("Error fetching or creating homepage content:", error);
      return null;
    }

    return this.mapPrismaHomePageToHomePageEntity(homePageRecord);
  }

  async updateHomepage(data: UpdateHomepageDTO): Promise<HomepageEntity> {
    const existingHomepage = await this.getHomePage();

    if (!existingHomepage) {
      throw new Error("Failed to retrieve or create homepage record for update operation.");
    }

    try {
      const updatedPrismaHomepage = await prisma.homePage.update({
        where: { id: existingHomepage.id },
        data: {
          sections: data.sections as unknown as Prisma.JsonArray,
          seoTitle: data.seoTitle ?? '',
          seoDescription: data.seoDescription ?? '',
        },
      });
      return this.mapPrismaHomePageToHomePageEntity(updatedPrismaHomepage);
    } catch (error) {
      console.error(`Error updating homepage content with ID ${existingHomepage.id}:`, error);
      throw new Error(`Failed to update homepage content: ${(error as Error).message || 'An unknown error occurred.'}`);
    }
  }
}