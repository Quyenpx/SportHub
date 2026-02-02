import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface CreateNotificationDto {
    userId: string;
    type: 'BOOKING_NEW' | 'BOOKING_APPROVED' | 'BOOKING_REJECTED' | 'BOOKING_CANCELLED';
    bookingId?: string;
    message: string;
}

@Injectable()
export class NotificationsService {
    constructor(private prisma: DatabaseService) { }

    async create(data: CreateNotificationDto) {
        return this.prisma.notification.create({
            data: {
                userId: data.userId,
                type: data.type,
                bookingId: data.bookingId,
                message: data.message,
            },
        });
    }

    async findByUser(userId: string, limit = 50) {
        return this.prisma.notification.findMany({
            where: { userId },
            include: {
                booking: {
                    include: {
                        court: {
                            include: { venue: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }

    async getUnreadCount(userId: string) {
        return this.prisma.notification.count({
            where: {
                userId,
                read: false,
            },
        });
    }

    async markAsRead(id: string, userId: string) {
        // Verify ownership before marking as read
        const notification = await this.prisma.notification.findFirst({
            where: { id, userId },
        });

        if (!notification) {
            throw new Error('Notification not found or unauthorized');
        }

        return this.prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }

    async markAllAsRead(userId: string) {
        return this.prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
    }
}
