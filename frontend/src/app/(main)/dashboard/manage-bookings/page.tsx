'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Phone, Mail, Clock, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Booking {
    id: string;
    startTime: string;
    endTime: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED';
    totalPrice: number;
    user: {
        id: string;
        fullName: string;
        email: string;
        phoneNumber?: string;
    };
    court: {
        id: string;
        name: string;
        venue: {
            id: string;
            name: string;
        };
    };
}

export default function ManageBookingsPage() {
    const searchParams = useSearchParams();
    const highlightId = searchParams.get('highlight');
    const { toast } = useToast();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [venues, setVenues] = useState<any[]>([]);
    const [selectedVenue, setSelectedVenue] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('PENDING');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVenues();
    }, []);

    useEffect(() => {
        if (venues.length > 0) {
            fetchBookings();
        }
    }, [selectedVenue, venues]);

    const fetchVenues = async () => {
        try {
            const response = await apiClient.get('/venues/my-venues');
            setVenues(response.data);
        } catch (error) {
            console.error('Failed to fetch venues', error);
        }
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            if (selectedVenue === 'all') {
                const allBookings: Booking[] = [];
                for (const venue of venues) {
                    const response = await apiClient.get(`/bookings/venue/${venue.id}`);
                    allBookings.push(...response.data);
                }
                setBookings(allBookings);
            } else {
                const response = await apiClient.get(`/bookings/venue/${selectedVenue}`);
                setBookings(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (bookingId: string) => {
        try {
            await apiClient.patch(`/bookings/${bookingId}/status`, { status: 'CONFIRMED' });
            toast({
                title: 'Thành công',
                description: 'Đã chấp nhận booking',
            });
            fetchBookings();
        } catch (error: any) {
            console.error('Failed to approve booking', error);
            toast({
                title: 'Lỗi',
                description: error.response?.data?.message || 'Không thể chấp nhận booking',
                variant: 'destructive',
            });
        }
    };

    const handleReject = async (bookingId: string) => {
        try {
            await apiClient.patch(`/bookings/${bookingId}/status`, { status: 'REJECTED' });
            toast({
                title: 'Thành công',
                description: 'Đã từ chối booking',
            });
            fetchBookings();
        } catch (error: any) {
            console.error('Failed to reject booking', error);
            toast({
                title: 'Lỗi',
                description: error.response?.data?.message || 'Không thể từ chối booking',
                variant: 'destructive',
            });
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: Booking['status']) => {
        const variants: Record<Booking['status'], { variant: any; label: string }> = {
            PENDING: { variant: 'secondary', label: 'Chờ duyệt' },
            CONFIRMED: { variant: 'default', label: 'Đã duyệt' },
            CANCELLED: { variant: 'destructive', label: 'Đã hủy' },
            REJECTED: { variant: 'outline', label: 'Đã từ chối' },
        };
        const { variant, label } = variants[status];
        return <Badge variant={variant as any}>{label}</Badge>;
    };

    const filteredBookings = bookings.filter((booking) => {
        if (statusFilter !== 'all' && booking.status !== statusFilter) {
            return false;
        }
        return true;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-black tracking-tighter mb-2">
                    Quản lý <span className="text-primary italic">Bookings</span>
                </h1>
                <p className="text-muted-foreground">
                    Xem và quản lý các booking cho sân của bạn
                </p>
            </div>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium mb-2 block">Sân</label>
                    <select
                        className="w-full border rounded-xl px-4 py-2.5 bg-background"
                        value={selectedVenue}
                        onChange={(e) => setSelectedVenue(e.target.value)}
                    >
                        <option value="all">Tất cả sân</option>
                        {venues.map((venue) => (
                            <option key={venue.id} value={venue.id}>
                                {venue.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium mb-2 block">Trạng thái</label>
                    <select
                        className="w-full border rounded-xl px-4 py-2.5 bg-background"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="PENDING">Chờ duyệt</option>
                        <option value="all">Tất cả</option>
                        <option value="CONFIRMED">Đã duyệt</option>
                        <option value="REJECTED">Đã từ chối</option>
                        <option value="CANCELLED">Đã hủy</option>
                    </select>
                </div>
            </div>

            {/* Bookings List */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : filteredBookings.length === 0 ? (
                <Card className="p-12 text-center glass-card rounded-3xl">
                    <Calendar className="h-20 w-20 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-xl font-bold mb-2">Không có booking nào</p>
                    <p className="text-muted-foreground">Chưa có booking {statusFilter !== 'all' && `ở trạng thái này`}</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                        <Card
                            key={booking.id}
                            className={`p-6 glass-card rounded-3xl ${highlightId === booking.id ? 'ring-2 ring-primary' : ''
                                }`}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="font-bold text-xl">{booking.court.name}</h3>
                                        {getStatusBadge(booking.status)}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {booking.court.venue.name}
                                    </p>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{formatDate(booking.startTime)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Khách hàng:</p>
                                        <p className="font-medium">{booking.user.fullName}</p>
                                        <p className="text-sm text-muted-foreground">{booking.user.email}</p>

                                        {booking.status === 'CONFIRMED' && booking.user.phoneNumber && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <Phone className="h-4 w-4 text-primary" />
                                                <a
                                                    href={`tel:${booking.user.phoneNumber}`}
                                                    className="text-sm text-primary hover:underline font-medium"
                                                >
                                                    {booking.user.phoneNumber}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 min-w-[180px]">
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-primary">
                                            {booking.totalPrice.toLocaleString('vi-VN')}đ
                                        </p>
                                    </div>

                                    {booking.status === 'PENDING' && (
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                onClick={() => handleApprove(booking.id)}
                                                className="w-full rounded-xl"
                                            >
                                                <Check className="h-4 w-4 mr-2" />
                                                Chấp nhận
                                            </Button>
                                            <Button
                                                onClick={() => handleReject(booking.id)}
                                                className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white border-0"
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                Từ chối
                                            </Button>
                                        </div>
                                    )}

                                    {booking.status === 'CONFIRMED' && (
                                        <Button variant="outline" className="w-full rounded-xl" asChild>
                                            <a href={`mailto:${booking.user.email}`}>
                                                <Mail className="h-4 w-4 mr-2" />
                                                Gửi email
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
