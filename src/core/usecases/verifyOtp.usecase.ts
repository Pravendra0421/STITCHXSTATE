import { IUserRepository } from "../repositories/IUserRepository";
import { VerifyOtpDto,LoginResponseDto } from "../dtos/User.dto";

export class VerifyOtpUseCase{
    constructor(private readonly userRepository:IUserRepository){}

    async execute(verifyData:VerifyOtpDto):Promise<LoginResponseDto>{
        const loginResponse = await this.userRepository.verifyOtpAndLogin(
            verifyData.email,
            verifyData.otp
        );
        return loginResponse;
    }
}