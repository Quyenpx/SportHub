'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Notification {
    id: string;
    type: string;
    message: string;
    read: boolean;
    createdAt: string;
    bookingId?: string;
}

export function NotificationBell() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    // Polling để lấy unread count
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // 30 giây
        return () => clearInterval(interval);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const response = await apiClient.get('/notifications/unread-count');
            setUnreadCount(response.data);
        } catch (error) {
            console.error('Failed to fetch unread count', error);
        }
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/notifications?limit=20');
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBellClick = () => {
        if (!showDropdown) {
            fetchNotifications();
        }
        setShowDropdown(!showDropdown);
    };

    const handleNotificationClick = async (notification: Notification) => {
        // Đánh dấu đã đọc
        if (!notification.read) {
            try {
                await apiClient.patch(`/notifications/${notification.id}/read`);
                setUnreadCount(prev => Math.max(0, prev - 1));
                setNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
                );
            } catch (error) {
                console.error('Failed to mark as read', error);
            }
        }

        // Navigate đến booking nếu có
        if (notification.bookingId) {
            router.push(`/dashboard/bookings?highlight=${notification.bookingId}`);
        }
        setShowDropdown(false);
    };

    const markAllAsRead = async () => {
        try {
            await apiClient.patch('/notifications/read-all');
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'BOOKING_NEW':
                return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
            case 'BOOKING_APPROVED':
                return 'text-green-600 bg-green-50 dark:bg-green-900/20';
            case 'BOOKING_REJECTED':
                return 'text-red-600 bg-red-50 dark:bg-red-900/20';
            case 'BOOKING_CANCELLED':
                return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
            default:
                return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days < 7) return `${days} ngày trước`;
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={handleBellClick}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </Button>

            {showDropdown && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border z-50 max-h-[500px] flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-lg">Thông báo</h3>
                            {notifications.filter(n => !n.read).length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={markAllAsRead}
                                    className="text-xs"
                                >
                                    Đánh dấu đã đọc tất cả
                                </Button>
                            )}
                        </div>

                        <div className="overflow-y-auto flex-1">
                            {loading ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    Đang tải...
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    Không có thông báo nào
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                            }`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notification.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm mb-1">{notification.message}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatTime(notification.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="p-2 border-t">
                                <Button
                                    variant="ghost"
                                    className="w-full text-sm"
                                    onClick={() => {
                                        router.push('/dashboard/bookings');
                                        setShowDropdown(false);
                                    }}
                                >
                                    Xem tất cả
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
