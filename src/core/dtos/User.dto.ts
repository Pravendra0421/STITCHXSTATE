export interface CreateUserDto{
    firstName :string;
    lastName:string;
    email:string;
    password:string;
    phone?:string;
    isAdmin?:boolean;
}

export interface UpdateUserDto {
    firstName?:string;
    lastName?:string;
    email?:string;
    password?:string;
    phone?:string;
    isAdmin?:boolean;
}

export interface userResponseDto {
    id:string;
    firstName:string;
    lastName:string;
    email:string;
    phone?:string;
    createdAt:Date;
    updatedAt:Date;
    isAdmin:boolean;
}

export interface RequestOtpDto{
    email:string;
}

export interface VerifyOtpDto{
    email:string;
    otp:string;
}

export interface LoginResponseDto {
    token:string;
    user:userResponseDto
}