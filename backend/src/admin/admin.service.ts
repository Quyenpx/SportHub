import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AdminService {
    constructor(private prisma: DatabaseService) { }

    // Dashboard Stats
    async getDashboardStats() {
        const [totalUsers, totalVenues, totalBookings, pendingRequests] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.venue.count(),
            this.prisma.booking.count(),
            this.prisma.venueManagerRequest.count({
                where: { status: 'PENDING' }
            }),
        ]);

        return {
            totalUsers,
            totalVenues,
            totalBookings,
            pendingRequests,
        };
    }

    // User Management
    async getAllUsers(page: number = 1, limit: number = 20, role?: string, status?: string) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (role) where.role = role;
        if (status) where.status = status;

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    phoneNumber: true,
                    role: true,
                    status: true,
                    provider: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async updateUserStatus(userId: string, status: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User không tồn tại');
        }

        return this.prisma.user.update({
            where: { id: userId },
            data: { status: status as any }, // Cast to avoid enum type error
        });
    }

    // Venue Manager Requests
    async getVenueManagerRequests(status?: string) {
        const where: any = {};
        if (status) where.status = status;

        return this.prisma.venueManagerRequest.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        phoneNumber: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async approveVenueManager(requestId: string, adminId: string) {
        const request = await this.prisma.venueManagerRequest.findUnique({
            where: { id: requestId },
            include: { user: true },
        });

        if (!request) {
            throw new NotFoundException('Request không tồn tại');
        }

        if (request.status !== 'PENDING') {
            throw new ForbiddenException('Request đã được xử lý');
        }

        // Update request
        await this.prisma.venueManagerRequest.update({
            where: { id: requestId },
            data: {
                status: 'APPROVED',
                reviewedBy: adminId,
                reviewedAt: new Date(),
            },
        });

        // Update user status to ACTIVE
        await this.prisma.user.update({
            where: { id: request.userId },
            data: { status: 'ACTIVE' },
        });

        return { message: 'Đã phê duyệt venue manager thành công' };
    }

    async rejectVenueManager(requestId: string, adminId: string, reason?: string) {
        const request = await this.prisma.venueManagerRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            throw new NotFoundException('Request không tồn tại');
        }

        if (request.status !== 'PENDING') {
            throw new ForbiddenException('Request đã được xử lý');
        }

        // Update request
        await this.prisma.venueManagerRequest.update({
            where: { id: requestId },
            data: {
                status: 'REJECTED',
                reviewedBy: adminId,
                reviewedAt: new Date(),
                note: reason || request.note,
            },
        });

        // Update user status to REJECTED
        await this.prisma.user.update({
            where: { id: request.userId },
            data: { status: 'REJECTED' },
        });

        return { message: 'Đã từ chối request' };
    }

    // Venue Management
    async getAllVenues(page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        const [venues, total] = await Promise.all([
            this.prisma.venue.findMany({
                skip,
                take: limit,
                include: {
                    owner: {
                        select: {
                            id: true,
                            email: true,
                            fullName: true,
                            phoneNumber: true,
                        },
                    },
                    courts: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.venue.count(),
        ]);

        return {
            venues,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async deleteVenue(venueId: string) {
        const venue = await this.prisma.venue.findUnique({
            where: { id: venueId },
        });

        if (!venue) {
            throw new NotFoundException('Venue không tồn tại');
        }

        await this.prisma.venue.delete({
            where: { id: venueId },
        });

        return { message: 'Đã xóa venue thành công' };
    }

    // Match Management
    async getAllMatches(page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        const [matches, total] = await Promise.all([
            this.prisma.match.findMany({
                skip,
                take: limit,
                include: {
                    host: {
                        select: {
                            id: true,
                            email: true,
                            fullName: true,
                        },
                    },
                    players: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    fullName: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.match.count(),
        ]);

        return {
            matches,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async deleteMatch(matchId: string) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
        });

        if (!match) {
            throw new NotFoundException('Match không tồn tại');
        }

        await this.prisma.match.delete({
            where: { id: matchId },
        });

        return { message: 'Đã xóa match thành công' };
    }
}
