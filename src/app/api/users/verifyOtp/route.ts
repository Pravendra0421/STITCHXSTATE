import { NextResponse } from "next/server";
import { PrismaUserRepository } from "@/core/repositories/IUserRepository";
import { VerifyOtpUseCase } from "@/core/usecases/verifyOtp.usecase";
import { VerifyOtpDto } from "@/core/dtos/User.dto";
const userRepo = new PrismaUserRepository();
const verifyOtpUseCase = new VerifyOtpUseCase(userRepo);

export async function POST(request:Request){
    try{
        const body:VerifyOtpDto = await request.json();
        if(!body.email || !body.otp){
            return NextResponse.json({message:"Email and otp are required for login"},{status:400});
        }
        const loginResponse = await verifyOtpUseCase.execute(body);
        const response= NextResponse.json(loginResponse,{status:200});
        response.cookies.set('token',loginResponse.token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60, // 1 hour
        })
        return response;
    }
    catch(error: unknown){
        console.error("Error during otp verification and login ",error);
        let errorMessage = 'Login failed. Please try again.';
        let statusCode = 401; // Default to Unauthorized

        if (error instanceof Error) {
            if (error.message.includes('Invalid email or OTP.')) {
                errorMessage = 'Invalid email or OTP. Please check your credentials.';
            } else if (error.message.includes('OTP has expired.')) {
                errorMessage = 'Your OTP has expired. Please request a new one.';
                statusCode = 403; // Forbidden
            } else if (error.message.includes('Invalid OTP.')) {
                errorMessage = 'The OTP you entered is incorrect. Please try again.';
            }
            return NextResponse.json({ message: errorMessage }, { status: statusCode });
        }
        return NextResponse.json({ message: errorMessage }, { status: statusCode });
    }
}