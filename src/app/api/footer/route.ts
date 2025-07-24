import { FooterSectionUsecase } from "@/core/usecases/FooterSection.usecase";
import { FooterRepository } from "@/core/repositories/IFooterRepository";
import { NextResponse } from "next/server";

const footerrepository=new FooterRepository();
const footerUseCase = new FooterSectionUsecase(footerrepository);

export async function GET(){
    try {
        const footer= await footerUseCase.getFooter();
        if(!footer){
            return NextResponse.json({message:'Footer  not found  or could not be created '},{status:404});
        }
        return NextResponse.json(footer,{status:200})
    } catch (error) {
        console.error('API ERROR:',error);
        return NextResponse.json({message:'Internal Server Error'},{status:500});
    }
}

export async function PUT(req:Request){
    try {
        const data=await req.json()
        const UpdateFooter = await footerUseCase.updateFooter(data);
        return NextResponse.json(UpdateFooter,{status:200})
    } catch (error) {
        console.error('API Error:',error);
        return NextResponse.json({message:'Error updating Footer'},{status:500})
    }
}