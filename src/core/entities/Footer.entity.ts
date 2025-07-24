export interface NavLink{
    label:string;
    url:string;
}
export interface socialIcon{
    iconName:string,
    url:string
}
export interface FooterEntity{
    description:string;
    category:NavLink[];
    season:NavLink[];
    about:NavLink[];
    socialIcons:socialIcon[];
}
export interface FooterSection{
    id:string;
    sections:FooterEntity[];
    createdAt:Date;
    updatedAt:Date;
}