
export interface socialIcon{
    iconName:string,
    url:string
}

export interface NavLink{
    label:string;
    url:string;
}
export interface HeaderEntity{
    logo:string,
    mainNavlinks:NavLink[];
    mainNav:{
        shop:NavLink;
        season:NavLink;
        journal:NavLink;
        themeFeatures:NavLink;
    }
    socialIcons:socialIcon[];
}
export interface HeaderSection{
        id:string;
        sections:HeaderEntity[];
        createdAt:Date;
        updatedAt:Date;
}