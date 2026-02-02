'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Trophy, TrendingUp, Clock, Zap } from 'lucide-react';
import apiClient from '@/lib/api-client';
import Link from 'next/link';

interface DashboardStats {
    bookingsCount: number;
    upcomingBookings: number;
    totalSpent: number;
}

export default function UserDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        bookingsCount: 0,
        upcomingBookings: 0,
        totalSpent: 0
    });
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await apiClient.get('/bookings/me');
            const bookings = response.data;

            const now = new Date();
            const upcoming = bookings.filter((b: any) => new Date(b.startTime) > now && b.status !== 'CANCELLED');
            const total = bookings.reduce((sum: number, b: any) => sum + parseFloat(b.totalPrice), 0);

            setStats({
                bookingsCount: bookings.length,
                upcomingBookings: upcoming.length,
                totalSpent: total
            });

            setRecentBookings(bookings.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
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
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md mb-4">
                    <Zap className="h-4 w-4 fill-primary animate-pulse" />
                    <span>Dashboard</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                    Xin chào, <span className="text-primary italic">Vận động viên</span>
                </h1>
                <p className="text-lg text-muted-foreground">Tổng quan hoạt động của bạn trên SportHub</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card rounded-3xl p-6 hover:-translate-y-1 transition-transform">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="text-3xl font-black mb-1">{stats.bookingsCount}</h3>
                    <p className="text-sm text-muted-foreground font-medium">Tổng lượt đặt sân</p>
                </div>

                <div className="glass-card rounded-3xl p-6 hover:-translate-y-1 transition-transform">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-green-500/10 rounded-2xl">
                            <Clock className="h-6 w-6 text-green-500" />
                        </div>
                        <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-3xl font-black mb-1">{stats.upcomingBookings}</h3>
                    <p className="text-sm text-muted-foreground font-medium">Booking sắp tới</p>
                </div>

                <div className="glass-card rounded-3xl p-6 hover:-translate-y-1 transition-transform">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-2xl">
                            <Zap className="h-6 w-6 text-purple-500" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black mb-1">{stats.totalSpent.toLocaleString()}₫</h3>
                    <p className="text-sm text-muted-foreground font-medium">Tổng chi tiêu</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-2xl font-black mb-4">Hành động nhanh</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                        variant="outline"
                        className="h-24 rounded-2xl flex flex-col items-center justify-center gap-2 border-2"
                        onClick={() => router.push('/venues')}
                    >
                        <MapPin className="h-6 w-6" />
                        <span className="font-bold">Tìm sân</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-24 rounded-2xl flex flex-col items-center justify-center gap-2 border-2"
                        onClick={() => router.push('/matches')}
                    >
                        <Trophy className="h-6 w-6" />
                        <span className="font-bold">Ghép kèo</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-24 rounded-2xl flex flex-col items-center justify-center gap-2 border-2"
                        onClick={() => router.push('/dashboard/bookings')}
                    >
                        <Calendar className="h-6 w-6" />
                        <span className="font-bold">Lịch của tôi</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-24 rounded-2xl flex flex-col items-center justify-center gap-2 border-2"
                        onClick={() => router.push('/profile')}
                    >
                        <Zap className="h-6 w-6" />
                        <span className="font-bold">Hồ sơ</span>
                    </Button>
                </div>
            </div>

            {/* Recent Bookings */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-black">Booking gần đây</h2>
                    <Link href="/dashboard/bookings" className="text-primary font-bold text-sm hover:underline">
                        Xem tất cả
                    </Link>
                </div>
                <div className="space-y-4">
                    {recentBookings.length > 0 ? (
                        recentBookings.map((booking) => (
                            <div key={booking.id} className="glass-card rounded-2xl p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{booking.court?.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(booking.startTime).toLocaleDateString('vi-VN')} • {new Date(booking.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-lg text-primary">{parseFloat(booking.totalPrice).toLocaleString()}₫</p>
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 glass-card rounded-3xl">
                            <Calendar className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-muted-foreground">Chưa có booking nào</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
