import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: DatabaseService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        // Check if user is PENDING
        if (user.status === 'PENDING') {
            throw new UnauthorizedException(
                'Tài khoản đang chờ phê duyệt từ admin. Vui lòng chờ email xác nhận.'
            );
        }

        if (user.status === 'REJECTED') {
            throw new UnauthorizedException(
                'Tài khoản đã bị từ chối. Vui lòng liên hệ admin để biết thêm chi tiết.'
            );
        }

        if (user.status === 'SUSPENDED') {
            throw new UnauthorizedException('Tài khoản đã bị tạm khóa');
        }

        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                status: user.status,
            },
        };
    }

    async register(dto: RegisterDto) {
        const existingUser = await this.usersService.findOne(dto.email);
        if (existingUser) {
            throw new BadRequestException('Email đã tồn tại trong hệ thống');
        }

        // Validate phoneNumber
        if (!dto.phoneNumber) {
            throw new BadRequestException('Số điện thoại là bắt buộc');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Create user with appropriate status
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                fullName: dto.fullName,
                phoneNumber: dto.phoneNumber,
                role: dto.role,
                status: dto.role === 'VENUE_MANAGER' ? 'PENDING' : 'ACTIVE',
                provider: 'LOCAL',
            },
        });

        // If VENUE_MANAGER, create approval request
        if (dto.role === 'VENUE_MANAGER') {
            await this.prisma.venueManagerRequest.create({
                data: {
                    userId: user.id,
                    status: 'PENDING',
                    businessName: dto.businessInfo?.businessName,
                    businessPhone: dto.businessInfo?.businessPhone,
                    note: dto.businessInfo?.note,
                },
            });
        }

        const { password, ...result } = user;

        return {
            user: result,
            message: dto.role === 'VENUE_MANAGER'
                ? 'Đăng ký thành công. Tài khoản của bạn đang chờ admin phê duyệt.'
                : 'Đăng ký thành công. Bạn có thể đăng nhập ngay.',
        };
    }

    async validateOAuthUser(profile: {
        email: string;
        fullName: string;
        provider: 'GOOGLE' | 'FACEBOOK';
        providerId: string;
        avatarUrl?: string;
    }) {
        // Tìm user theo email
        let user = await this.usersService.findOne(profile.email);

        if (user) {
            // User đã tồn tại, cập nhật provider info nếu cần
            return user;
        }

        // Tạo user mới với OAuth provider
        // OAuth users default to PLAYER role with ACTIVE status
        user = await this.prisma.user.create({
            data: {
                email: profile.email,
                fullName: profile.fullName,
                provider: profile.provider,
                avatarUrl: profile.avatarUrl,
                password: null, // OAuth users không có password
                phoneNumber: '', // OAuth users cần update phone sau
                role: 'PLAYER',
                status: 'ACTIVE',
            },
        });

        return user;
    }
}
