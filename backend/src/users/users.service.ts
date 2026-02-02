import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: DatabaseService) { }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }

    async findOne(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string): Promise<Omit<User, 'password'>> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                fullName: true,
                phoneNumber: true,
                role: true,
                status: true,
                provider: true,
                avatarUrl: true,
                createdAt: true,
                updatedAt: true,
                password: false
            }
        });

        if (!user) {
            throw new NotFoundException('User không tồn tại');
        }

        return user;
    }

    async updateProfile(id: string, data: { fullName?: string; avatarUrl?: string; phoneNumber?: string }) {
        try {
            const updatedUser = await this.prisma.user.update({
                where: { id },
                data,
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    phoneNumber: true,
                    role: true,
                    provider: true,
                    avatarUrl: true,
                    createdAt: true,
                    updatedAt: true,
                    password: false
                }
            });
            return updatedUser;
        } catch (error) {
            throw new NotFoundException('User không tồn tại');
        }
    }

    async updatePassword(id: string, currentPassword: string, newPassword: string) {
        const bcrypt = require('bcrypt');

        // Lấy user với password
        const user = await this.prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw new NotFoundException('User không tồn tại');
        }

        // Kiểm tra nếu user dùng OAuth (không có password)
        if (!user.password) {
            throw new BadRequestException('Tài khoản đăng nhập bằng mạng xã hội không thể đổi mật khẩu');
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await this.prisma.user.update({
            where: { id },
            data: { password: hashedPassword }
        });

        return { message: 'Đổi mật khẩu thành công' };
    }

    async getPublicProfile(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                role: true,
                createdAt: true,
                password: false,
                email: false, // Ẩn email trong profile công khai
            }
        });

        if (!user) {
            throw new NotFoundException('User không tồn tại');
        }

        return user;
    }
}

