// import { HomePageSection } from "../entities/HomePage.entity";
// // DTO for updating (only sections needed)
// export interface UpdateHomepageDTO {
//   sections: HomePageSection[];
// }
import { FooterEntity } from "../entities/Footer.entity";
import { FooterSection } from "../entities/Footer.entity";
export interface UpdateFooterDto{
    sections:FooterEntity[];
}