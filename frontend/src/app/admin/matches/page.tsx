'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Trophy, Trash2, User, MapPin, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Match {
    id: string;
    sport: string;
    level: string;
    startTime: string;
    location: string | null;
    maxPlayers: number;
    status: string;
    description: string | null;
    createdAt: string;
    host: {
        id: string;
        email: string;
        fullName: string;
    };
    players: any[];
}

export default function MatchesManagementPage() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/admin/matches');
            setMatches(res.data.matches || []);
        } catch (error) {
            console.error('Failed to fetch matches', error);
            toast.error('Không thể tải danh sách kèo đấu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (matchId: string) => {
        if (!confirm('Bạn có chắc muốn xóa kèo đấu này? Hành động này không thể hoàn tác.')) {
            return;
        }

        try {
            await apiClient.delete(`/admin/matches/${matchId}`);
            toast.success('Đã xóa kèo đấu thành công');
            fetchMatches();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Xóa kèo đấu thất bại');
        }
    };

    const getStatusBadge = (status: string) => {
        const colors: any = {
            OPEN: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
            FULL: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
            CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
            COMPLETED: 'bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusText = (status: string) => {
        const text: any = {
            OPEN: 'Đang mở',
            FULL: 'Đã đủ',
            CANCELLED: 'Đã hủy',
            COMPLETED: 'Hoàn thành',
        };
        return text[status] || status;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black">Quản lý kèo đấu</h1>
                <p className="text-muted-foreground mt-1">Quản lý tất cả kèo đấu trong hệ thống</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 animate-pulse">
                            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : matches.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 text-center">
                    <Trophy className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Chưa có kèo đấu nào</h3>
                    <p className="text-muted-foreground">Hệ thống chưa có kèo đấu nào</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {matches.map((match) => (
                        <div
                            key={match.id}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                                        <Trophy className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg">{match.sport}</h3>
                                            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 rounded text-xs font-semibold">
                                                {match.level}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Host: {match.host.fullName}
                                        </p>
                                    </div>
                                </div>

                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(match.status)}`}>
                                    {getStatusText(match.status)}
                                </span>
                            </div>

                            {match.description && (
                                <p className="text-sm mb-4 text-muted-foreground">
                                    {match.description}
                                </p>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{new Date(match.startTime).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span>{match.players.length}/{match.maxPlayers} người</span>
                                </div>
                                {match.location && (
                                    <div className="flex items-center gap-2 text-sm col-span-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="truncate">{match.location}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                    Tạo: {new Date(match.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                                <Button
                                    onClick={() => handleDelete(match.id)}
                                    variant="outline"
                                    size="sm"
                                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30"
                                >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Xóa
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="text-sm text-muted-foreground text-center">
                Tổng cộng {matches.length} kèo đấu
            </div>
        </div>
    );
}
