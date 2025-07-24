import { HomePageSection } from "../entities/HomePage.entity";
// DTO for updating (only sections needed)
export interface UpdateHomepageDTO {
  sections: HomePageSection[];
  seoTitle?: string;
  seoDescription?: string;
}