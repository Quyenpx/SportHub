'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle, Phone, Mail } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface Booking {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    totalPrice: number;
    court: {
        name: string;
        type: string;
        venue: {
            name: string;
            address: string;
            owner?: {
                id: string;
                fullName: string;
                phoneNumber?: string;
                email: string;
            };
        };
    };
}


export default function DashboardBookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await apiClient.get('/bookings/me');
            setBookings(response.data);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (booking: Booking) => {
        const now = new Date();
        const startTime = new Date(booking.startTime);
        const diffMs = startTime.getTime() - now.getTime();
        const twoHoursMs = 2 * 60 * 60 * 1000;

        if (diffMs < twoHoursMs) {
            alert('Bạn chỉ có thể hủy trước giờ bắt đầu ít nhất 2 tiếng. Vui lòng liên hệ chủ sân để được hỗ trợ.');
            return;
        }

        if (!confirm('Bạn có chắc muốn hủy booking này?')) return;

        try {
            await apiClient.patch(`/bookings/${booking.id}/status`, { status: 'CANCELLED' });
            fetchBookings();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Không thể hủy booking. Vui lòng thử lại.');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return (
                    <span className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full font-bold">
                        <CheckCircle className="h-3 w-3" />
                        Đã xác nhận
                    </span>
                );
            case 'PENDING':
                return (
                    <span className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full font-bold">
                        <AlertCircle className="h-3 w-3" />
                        Chờ xác nhận
                    </span>
                );
            case 'CANCELLED':
                return (
                    <span className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full font-bold">
                        <XCircle className="h-3 w-3" />
                        Đã hủy
                    </span>
                );
            default:
                return <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-bold">{status}</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-4 md:py-8">
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter mb-2">
                    Lịch <span className="text-primary italic">Đặt sân</span>
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">Quản lý tất cả các booking của bạn</p>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-12 md:py-20 glass-card rounded-2xl md:rounded-3xl">
                    <Calendar className="h-16 w-16 md:h-20 md:w-20 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-xl md:text-2xl font-bold mb-2">Chưa có booking nào</h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-6">Bắt đầu đặt sân để tham gia các trận đấu</p>
                    <Button onClick={() => router.push('/venues')}>Tìm sân đấu</Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-6 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="space-y-3 flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                        <h3 className="text-lg md:text-xl font-bold">{booking.court.name}</h3>
                                        <div className="flex">
                                            {getStatusBadge(booking.status)}
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4 shrink-0 mt-1" />
                                        <span className="text-xs md:text-sm line-clamp-2">
                                            {booking.court.venue.name} - {booking.court.venue.address}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span className="text-sm font-medium">
                                                {new Date(booking.startTime).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span className="text-sm font-medium">
                                                {new Date(booking.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                {' - '}
                                                {new Date(booking.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-xl md:text-2xl font-black text-primary">
                                        {booking.totalPrice.toLocaleString()} VNĐ
                                    </div>

                                    {/* Hiển thị thông tin liên hệ chủ sân khi đã CONFIRMED */}
                                    {booking.status === 'CONFIRMED' && booking.court.venue.owner && (
                                        <div className="mt-4 pt-4 border-t">
                                            <p className="text-xs md:text-sm font-medium mb-2 text-muted-foreground">Thông tin chủ sân:</p>
                                            <p className="text-sm font-medium">{booking.court.venue.owner.fullName}</p>
                                            <div className="flex gap-2 mt-2 flex-wrap">
                                                {booking.court.venue.owner.phoneNumber && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                        className="rounded-xl flex-1 sm:flex-none"
                                                    >
                                                        <a href={`tel:${booking.court.venue.owner.phoneNumber}`}>
                                                            <Phone className="h-4 w-4 mr-2" />
                                                            {booking.court.venue.owner.phoneNumber}
                                                        </a>
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                    className="rounded-xl flex-1 sm:flex-none"
                                                >
                                                    <a href={`mailto:${booking.court.venue.owner.email}`}>
                                                        <Mail className="h-4 w-4 mr-2" />
                                                        Email
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex md:flex-col gap-2 w-full md:w-auto">
                                    {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && new Date(booking.startTime) > new Date() ? (
                                        <Button
                                            variant="destructive"
                                            className="rounded-xl w-full md:w-auto"
                                            onClick={() => handleCancelBooking(booking)}
                                        >
                                            Hủy booking
                                        </Button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
