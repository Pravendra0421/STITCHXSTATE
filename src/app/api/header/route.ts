import { HeaderSectionUseCases } from "@/core/usecases/HeaderSection.usecase";
import { HeaderRepository } from "@/core/repositories/IHeaderRepository";
import { NextResponse } from "next/server";

const headerpageRepository = new HeaderRepository();
const headerUseCases= new HeaderSectionUseCases(headerpageRepository);

export async function GET(){
    try {
        const header = await headerUseCases.getHeader();
        if(!header){
            return NextResponse.json({ message: 'Header not found or could not be created' }, { status: 404 });
        }
        return NextResponse.json(header,{status:200});
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
export async function PUT(req:Request){
    try {
        const data = await req.json()
        const updateHeader = await headerUseCases.updateHeader(data);
        return NextResponse.json(updateHeader, { status: 200 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ message: 'Error updating header' }, { status: 500 });
    }
}