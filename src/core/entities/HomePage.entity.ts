//1 carousel section
export interface CarouselImage {
    id:string;
    imageUrl:string;
    alt:string;

}
export interface CarouselSection{
    id:string;
    type:'carousel'
    images:CarouselImage[];
    intervalMs?:number      //time between slide in ms
}

//single image with timer section
export interface TimerSection{
    id:string;
    type:'timer';
    imageUrl:string;
    alt:string;
    title?:string;
    subTitle?:string;
    countdownTo?:string;
}

//Two image flex section
export interface FlexImage{
    id:string;
    url:string;
    alt:string;
    title?:string;
    subtitle?:string;
}
export interface TwoImageFlexSection{
    id:string;
    type:"two-image-flex";
    image1:FlexImage;
    image2:FlexImage;
}

export interface Promo{
    id:string;
    percentageText:string;
    image1Url:string;
    image1Alt:string;
    image2Url:string;
    image2Alt:string;
    ctaText?:string;
}
export interface PromoGrid{
    id:string;
    type:"promo-grid"
    pretitle?:string;
    imageUrl:string;
    title?:string;
    subtitle?:string;
    description?:string;
    promoLeft:Promo;
    promoRight:Promo;
}

export interface Look{
    id:string;
    title:string;
    type:'look';
    imageUrl:string;
    imageAlt:string;
}
export interface Post{
    id:string;
    imageUrl:string;
    imageAlt:string;
    title:string;
    description:string;
}
export interface BlogPost{
    id:string;
    type:'BlogPost'
    title:string;
    post1:Post;
    post2:Post;
    post3:Post;
}
export type HomePageSection =CarouselSection | TimerSection |TwoImageFlexSection | PromoGrid | Look |BlogPost;

export interface HomepageEntity{
    id:string;
    sections:HomePageSection[];
    createdAt:Date;
    updatedAt:Date;
    seoTitle?: string;
    seoDescription?: string;
}
