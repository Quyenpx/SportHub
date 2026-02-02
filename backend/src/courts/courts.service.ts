import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CourtsService {
    constructor(private prisma: DatabaseService) { }

    async create(data: Prisma.CourtCreateInput) {
        return this.prisma.court.create({ data });
    }

    async findAll() {
        return this.prisma.court.findMany({
            include: {
                venue: {
                    select: { id: true, name: true, address: true }
                }
            }
        });
    }

    async findOne(id: string) {
        const court = await this.prisma.court.findUnique({
            where: { id },
            include: {
                venue: true,
                bookings: {
                    where: {
                        status: {
                            in: ['PENDING', 'CONFIRMED']
                        }
                    },
                    orderBy: { startTime: 'asc' }
                }
            }
        });

        if (!court) {
            throw new NotFoundException(`Court với ID ${id} không tồn tại`);
        }

        return court;
    }

    async update(id: string, data: Prisma.CourtUpdateInput, userId: string) {
        // Verify ownership
        const court = await this.prisma.court.findUnique({
            where: { id },
            include: { venue: { select: { ownerId: true } } }
        });

        if (!court) {
            throw new NotFoundException(`Court với ID ${id} không tồn tại`);
        }

        if (court.venue.ownerId !== userId) {
            throw new ForbiddenException('Bạn không có quyền sửa court này');
        }

        return await this.prisma.court.update({
            where: { id },
            data,
        });
    }

    async remove(id: string, userId: string) {
        // Verify ownership
        const court = await this.prisma.court.findUnique({
            where: { id },
            include: { venue: { select: { ownerId: true } } }
        });

        if (!court) {
            throw new NotFoundException(`Court với ID ${id} không tồn tại`);
        }

        if (court.venue.ownerId !== userId) {
            throw new ForbiddenException('Bạn không có quyền xóa court này');
        }

        return await this.prisma.court.delete({
            where: { id },
        });
    }

    async findByVenue(venueId: string) {
        return this.prisma.court.findMany({
            where: { venueId },
        });
    }

    async checkAvailability(courtId: string, startTime: Date, endTime: Date): Promise<{ available: boolean; conflictingBookings?: any[] }> {
        // Tìm các bookings overlap với thời gian yêu cầu
        const conflictingBookings = await this.prisma.booking.findMany({
            where: {
                courtId,
                status: {
                    in: ['PENDING', 'CONFIRMED']
                },
                OR: [
                    {
                        AND: [
                            { startTime: { lte: startTime } },
                            { endTime: { gt: startTime } }
                        ]
                    },
                    {
                        AND: [
                            { startTime: { lt: endTime } },
                            { endTime: { gte: endTime } }
                        ]
                    },
                    {
                        AND: [
                            { startTime: { gte: startTime } },
                            { endTime: { lte: endTime } }
                        ]
                    }
                ]
            }
        });

        return {
            available: conflictingBookings.length === 0,
            conflictingBookings: conflictingBookings.length > 0 ? conflictingBookings : undefined
        };
    }
}

