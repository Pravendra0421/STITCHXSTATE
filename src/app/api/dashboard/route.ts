import { NextResponse } from "next/server";
import { DashboardRepository } from "@/core/repositories/IDashboardRepository";
import { DashboarduseCase } from "@/core/usecases/Dashboard.usecase";
import { PrismaUserRepository } from "@/core/repositories/IUserRepository";
const userRepository = new PrismaUserRepository()
const dashboardRepository= new DashboardRepository(userRepository);
const dashboarduseCase= new DashboarduseCase(dashboardRepository);
export async function GET(){
    try {
        const dashboardData = await dashboarduseCase.execute()
        return NextResponse.json(dashboardData);
    } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}