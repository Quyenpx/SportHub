import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma, BookingStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {
    constructor(
        private prisma: DatabaseService,
        private notificationsService: NotificationsService
    ) { }

    async create(data: Prisma.BookingCreateInput) {
        // Check overlap - CHỈ với bookings đã CONFIRMED
        // Cho phép nhiều bookings PENDING cùng lúc để owner có thể chọn
        const existing = await this.prisma.booking.findFirst({
            where: {
                courtId: data.court.connect?.id,
                status: 'CONFIRMED', // Chỉ check với bookings đã confirmed
                OR: [
                    {
                        startTime: { lt: data.endTime },
                        endTime: { gt: data.startTime }
                    }
                ]
            }
        });

        if (existing) {
            throw new BadRequestException('Sân đã được đặt và xác nhận trong khung giờ này');
        }

        // Fetch court to get price per hour
        const court = await this.prisma.court.findUnique({
            where: { id: data.court.connect?.id }
        });

        if (!court) {
            throw new NotFoundException('Sân không tồn tại');
        }

        // Calculate duration and price
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        // Ensure duration is positive
        if (durationHours <= 0) {
            throw new BadRequestException('Thời gian kết thúc phải sau thời gian bắt đầu');
        }

        const totalPrice = Number(court.pricePerHour) * durationHours;

        const booking = await this.prisma.booking.create({
            data: {
                ...data,
                totalPrice: totalPrice
            },
            include: {
                court: {
                    include: {
                        venue: {
                            include: { owner: true }
                        }
                    }
                },
                user: true
            }
        });

        // Gửi thông báo cho chủ sân
        const ownerId = booking.court.venue.ownerId;
        const startTimeStr = new Date(booking.startTime).toLocaleString('vi-VN');
        await this.notificationsService.create({
            userId: ownerId,
            type: 'BOOKING_NEW',
            bookingId: booking.id,
            message: `Bạn có booking mới từ ${booking.user.fullName} cho ${booking.court.name} vào ${startTimeStr}`
        });

        return booking;
    }

    private async autoCancelExpiredBookings() {
        // Tự động hủy các booking PENDING đã quá giờ bắt đầu
        await this.prisma.booking.updateMany({
            where: {
                status: 'PENDING',
                startTime: { lt: new Date() }
            },
            data: { status: 'CANCELLED' }
        });
    }

    async findAll() {
        await this.autoCancelExpiredBookings();
        return this.prisma.booking.findMany({
            include: {
                court: { include: { venue: true } },
                user: { select: { id: true, email: true, fullName: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: string) {
        // Không cần check expire khi find one (performance)
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                court: { include: { venue: { include: { owner: true } } } },
                user: { select: { id: true, email: true, fullName: true, phoneNumber: true } }
            }
        });

        if (!booking) {
            throw new NotFoundException(`Booking với ID ${id} không tồn tại`);
        }

        return booking;
    }

    async findByUser(userId: string) {
        await this.autoCancelExpiredBookings();
        return this.prisma.booking.findMany({
            where: { userId },
            include: {
                court: {
                    include: {
                        venue: { // Added venue include here
                            include: { owner: { select: { id: true, fullName: true, phoneNumber: true, email: true } } }
                        }
                    }
                }
            },
            orderBy: { startTime: 'desc' }
        });
    }

    async findByVenue(venueId: string) {
        await this.autoCancelExpiredBookings();
        // Lấy tất cả courts thuộc venue này
        const courts = await this.prisma.court.findMany({
            where: { venueId },
            select: { id: true }
        });

        const courtIds = courts.map(c => c.id);

        // Lấy tất cả bookings của các courts đó
        return this.prisma.booking.findMany({
            where: {
                courtId: { in: courtIds }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true
                    }
                },
                court: {
                    include: {
                        venue: true
                    }
                }
            },
            orderBy: {
                startTime: 'desc'
            }
        });
    }

    async updateStatus(id: string, status: BookingStatus) {
        try {
            // 1. Fetch current booking details first
            const currentBooking = await this.prisma.booking.findUnique({
                where: { id }
            });

            if (!currentBooking) {
                throw new NotFoundException(`Booking với ID ${id} không tồn tại`);
            }

            // 2. Check overlap logic if confirming
            if (status === 'CONFIRMED') {
                const overlapping = await this.prisma.booking.findFirst({
                    where: {
                        courtId: currentBooking.courtId,
                        status: 'CONFIRMED',
                        id: { not: id },
                        OR: [
                            { startTime: { lt: currentBooking.endTime }, endTime: { gt: currentBooking.startTime } }
                        ]
                    }
                });

                if (overlapping) {
                    throw new BadRequestException('Sân đã có người đặt trong khung giờ này (trùng lịch)');
                }
            }

            // Check cancellation policy (2 hours notice)
            if (status === 'CANCELLED') {
                const now = new Date();
                const startTime = new Date(currentBooking.startTime);
                const diffMs = startTime.getTime() - now.getTime();
                const twoHoursMs = 2 * 60 * 60 * 1000;

                // Nếu thời gian còn lại < 2 tiếng (hoặc đã quá giờ), không cho phép tự hủy
                if (diffMs < twoHoursMs) {
                    throw new BadRequestException('Chỉ có thể hủy booking trước giờ bắt đầu ít nhất 2 tiếng. Vui lòng liên hệ chủ sân để được hỗ trợ.');
                }
            }

            // 3. Perform update
            const booking = await this.prisma.booking.update({
                where: { id },
                data: { status },
                include: {
                    court: { include: { venue: true } },
                    user: { select: { id: true, email: true, fullName: true } }
                }
            });

            // Gửi thông báo
            if (status === 'CONFIRMED') {
                await this.notificationsService.create({
                    userId: booking.userId,
                    type: 'BOOKING_APPROVED',
                    bookingId: booking.id,
                    message: `Booking của bạn cho ${booking.court.name} đã được chấp nhận`
                });
            } else if (status === 'CANCELLED') {
                const court = await this.prisma.court.findUnique({
                    where: { id: booking.courtId },
                    include: { venue: true }
                });

                if (court) {
                    await this.notificationsService.create({
                        userId: court.venue.ownerId,
                        type: 'BOOKING_CANCELLED',
                        bookingId: booking.id,
                        message: `Booking cho ${booking.court.name} đã bị hủy bởi khách hàng`
                    });
                }
            } else if (status === 'REJECTED') {
                await this.notificationsService.create({
                    userId: booking.userId,
                    type: 'BOOKING_REJECTED',
                    bookingId: booking.id,
                    message: `Booking của bạn cho ${booking.court.name} đã bị từ chối`
                });
            }

            return booking;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new NotFoundException(`Lỗi khi cập nhật booking: ${error.message}`);
        }
    }
}

