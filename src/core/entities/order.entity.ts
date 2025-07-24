import { ProductVariationEntity } from "./product.entity";
export interface AddressEntity{
    firstName:string;
    lastName:string;
    address1:string;
    address2?:string;
    city:string;
    state:string;
    postalCode:string;
    country:string;
}
export interface ContactInfoEntity{
    email:string;
    phone:string;
}
export interface OrderItemEntity{
    id:string;
    orderId:string;
    productVariationId:string;
    quantity:number;
    price:number;
    productVariation:ProductVariationEntity;
}
export interface orderEntity{
    id:string;
    userId:string;
    status:string;
    paymentMethod:'Stripe'|'COD'|'UPI'
    shippingAddress:AddressEntity;
    contactInfo:ContactInfoEntity;
    items:OrderItemEntity[];
    createdAt:Date;
    updatedAt:Date;
}