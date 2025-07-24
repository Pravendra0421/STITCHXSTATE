import { NextRequest, NextResponse } from "next/server";
import { PrismaUserRepository } from "@/core/repositories/IUserRepository";
import { RequestOtpUseCase } from "@/core/usecases/RequestOtp.usecase";
import { RequestOtpDto } from "@/core/dtos/User.dto";
import nodemailer from 'nodemailer';

const userRepo = new PrismaUserRepository();
const requestOtpUseCase = new RequestOtpUseCase(userRepo);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body: RequestOtpDto = await request.json();
    if (!body.email) {
      return NextResponse.json({ message: "email is required " }, { status: 400 });
    }
    const { user, otp } = await requestOtpUseCase.execute(body);
    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your login OTP',
      text: `Your one time password (OTP) is: ${otp}. It is valid for 5 minutes`,
      html: `<b>Your One-Time Password (OTP) is: ${otp}</b>.<br>It is valid for 5 minutes.`
    });
    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
  } catch (error) {
    console.error("error during request otp", error);
    return NextResponse.json({ message: 'Failed to send OTP', error: (error as Error).message }, { status: 500 });
  }
}