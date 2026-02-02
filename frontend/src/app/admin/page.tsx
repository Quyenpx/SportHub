'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';
import { Users, Building2, Calendar, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

interface DashboardStats {
    totalUsers: number;
    totalVenues: number;
    totalBookings: number;
    pendingRequests: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await apiClient.get('/admin/dashboard/stats');
            setStats(res.data);
        } catch (error: any) {
            console.error('Failed to fetch stats', error);
            toast.error('Không thể tải thống kê');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-black">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 animate-pulse">
                            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-800 rounded-xl mb-4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20 mb-2"></div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const statCards = [
        {
            icon: Users,
            label: 'Tổng người dùng',
            value: stats?.totalUsers || 0,
            color: 'blue',
            bgColor: 'bg-blue-50 dark:bg-blue-950/30',
            iconColor: 'text-blue-600',
        },
        {
            icon: Building2,
            label: 'Tổng sân thể thao',
            value: stats?.totalVenues || 0,
            color: 'purple',
            bgColor: 'bg-purple-50 dark:bg-purple-950/30',
            iconColor: 'text-purple-600',
        },
        {
            icon: Calendar,
            label: 'Tổng đặt sân',
            value: stats?.totalBookings || 0,
            color: 'green',
            bgColor: 'bg-green-50 dark:bg-green-950/30',
            iconColor: 'text-green-600',
        },
        {
            icon: FileCheck,
            label: 'Yêu cầu chờ duyệt',
            value: stats?.pendingRequests || 0,
            color: 'orange',
            bgColor: 'bg-orange-50 dark:bg-orange-950/30',
            iconColor: 'text-orange-600',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Tổng quan hệ thống SportHub</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
                        >
                            <div className={`${card.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                                <Icon className={`h-6 w-6 ${card.iconColor}`} />
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
                            <p className="text-3xl font-black">{card.value.toLocaleString()}</p>
                        </div>
                    );
                })}
            </div>

            {stats && stats.pendingRequests > 0 && (
                <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <FileCheck className="h-6 w-6 text-orange-600 mt-1" />
                        <div>
                            <h3 className="font-bold text-orange-900 dark:text-orange-100">
                                Có {stats.pendingRequests} yêu cầu chờ phê duyệt
                            </h3>
                            <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                                Các yêu cầu đăng ký quản lý sân đang chờ bạn xem xét và phê duyệt.
                            </p>
                            <a
                                href="/admin/requests"
                                className="inline-block mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold"
                            >
                                Xem yêu cầu
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
