'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Building2, Trash2, MapPin, User } from 'lucide-react';
import { toast } from 'sonner';

interface Venue {
    id: string;
    name: string;
    address: string;
    description: string | null;
    sports: string[];
    images: string[];
    createdAt: string;
    owner: {
        id: string;
        email: string;
        fullName: string;
        phoneNumber: string;
    };
    courts: any[];
}

export default function VenuesManagementPage() {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/admin/venues');
            setVenues(res.data.venues || []);
        } catch (error) {
            console.error('Failed to fetch venues', error);
            toast.error('Không thể tải danh sách sân');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (venueId: string, venueName: string) => {
        if (!confirm(`Bạn có chắc muốn xóa sân "${venueName}"? Hành động này không thể hoàn tác.`)) {
            return;
        }

        try {
            await apiClient.delete(`/admin/venues/${venueId}`);
            toast.success('Đã xóa sân thành công');
            fetchVenues();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Xóa sân thất bại');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black">Quản lý sân thể thao</h1>
                <p className="text-muted-foreground mt-1">Quản lý tất cả sân thể thao trong hệ thống</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 animate-pulse">
                            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : venues.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 text-center">
                    <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Chưa có sân nào</h3>
                    <p className="text-muted-foreground">Hệ thống chưa có sân thể thao nào</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {venues.map((venue) => (
                        <div
                            key={venue.id}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                                        <Building2 className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{venue.name}</h3>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {venue.address}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {venue.description && (
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {venue.description}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-2 mb-4">
                                {venue.sports.map((sport) => (
                                    <span
                                        key={sport}
                                        className="px-2 py-1 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-semibold"
                                    >
                                        {sport}
                                    </span>
                                ))}
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-4">
                                <div className="flex items-center gap-2 text-sm mb-1">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-semibold">Chủ sân:</span>
                                </div>
                                <p className="text-sm ml-6">{venue.owner.fullName}</p>
                                <p className="text-xs text-muted-foreground ml-6">{venue.owner.email}</p>
                                <p className="text-xs text-muted-foreground ml-6">{venue.owner.phoneNumber}</p>
                            </div>

                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                <span>{venue.courts.length} sân con</span>
                                <span>{new Date(venue.createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>

                            <Button
                                onClick={() => handleDelete(venue.id, venue.name)}
                                variant="outline"
                                className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa sân
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <div className="text-sm text-muted-foreground text-center">
                Tổng cộng {venues.length} sân thể thao
            </div>
        </div>
    );
}
