import { IsEmail, IsString, MinLength, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum UserRole {
    PLAYER = 'PLAYER',
    VENUE_MANAGER = 'VENUE_MANAGER',
}

export class BusinessInfoDto {
    @IsOptional()
    @IsString()
    businessName?: string;

    @IsOptional()
    @IsString()
    businessPhone?: string;

    @IsOptional()
    @IsString()
    note?: string;
}

export class RegisterDto {
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password: string;

    @IsString()
    fullName: string;

    @IsString()
    phoneNumber: string;

    @IsEnum(UserRole, { message: 'Role phải là PLAYER hoặc VENUE_MANAGER' })
    role: UserRole;

    @IsOptional()
    @ValidateNested()
    @Type(() => BusinessInfoDto)
    businessInfo?: BusinessInfoDto;
}
