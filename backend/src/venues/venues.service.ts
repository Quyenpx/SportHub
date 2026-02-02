import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VenuesService {
    constructor(private prisma: DatabaseService) { }

    async create(data: Prisma.VenueCreateInput, userId: string) {
        // Check user status
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true, status: true, fullName: true }
        });

        if (!user) {
            throw new NotFoundException('User không tồn tại');
        }

        // Chỉ check status, không check role - cho phép tất cả user tạo sân
        if (user.status === 'PENDING') {
            throw new ForbiddenException('Tài khoản của bạn đang chờ admin phê duyệt. Vui lòng chờ email xác nhận.');
        }

        if (user.status === 'SUSPENDED') {
            throw new ForbiddenException('Tài khoản của bạn đã bị tạm khóa');
        }

        if (user.status === 'REJECTED') {
            throw new ForbiddenException('Tài khoản của bạn đã bị từ chối. Vui lòng liên hệ admin.');
        }

        return this.prisma.venue.create({ data });
    }

    async findAll() {
        return this.prisma.venue.findMany({
            include: { courts: true },
        });
    }

    async findById(id: string) {
        return this.prisma.venue.findUnique({
            where: { id },
            include: {
                courts: true,
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true,
                    }
                }
            },
        });
    }

    async update(id: string, data: Prisma.VenueUpdateInput, userId: string) {
        // Verify ownership
        const venue = await this.prisma.venue.findUnique({
            where: { id },
            select: { ownerId: true }
        });

        if (!venue) {
            throw new NotFoundException(`Venue với ID ${id} không tồn tại`);
        }

        if (venue.ownerId !== userId) {
            throw new ForbiddenException('Bạn không có quyền sửa venue này');
        }

        return await this.prisma.venue.update({
            where: { id },
            data,
        });
    }

    async findByOwner(ownerId: string) {
        return this.prisma.venue.findMany({
            where: { ownerId },
            include: { courts: true },
        });
    }

    async remove(id: string, userId: string) {
        // Verify ownership
        const venue = await this.prisma.venue.findUnique({
            where: { id },
            select: { ownerId: true }
        });

        if (!venue) {
            throw new NotFoundException(`Venue với ID ${id} không tồn tại`);
        }

        if (venue.ownerId !== userId) {
            throw new ForbiddenException('Bạn không có quyền xóa venue này');
        }

        return await this.prisma.venue.delete({
            where: { id },
        });
    }
}
