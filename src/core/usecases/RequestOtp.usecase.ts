import { IUserRepository } from "../repositories/IUserRepository";
import { RequestOtpDto } from "../dtos/User.dto";
import { UserEntity } from "../entities/User.entity";

export class RequestOtpUseCase {
    constructor(private readonly userRepository: IUserRepository) { }
    async execute(requestData: RequestOtpDto): Promise<{ user: UserEntity, otp: string }> {
        const { email } = requestData;
        const result = await this.userRepository.requestOtp(email);
        if (!result) {
            throw new Error('Failed to generate OTP. Please try again or contact support.');
        }
        return result;
    }
}