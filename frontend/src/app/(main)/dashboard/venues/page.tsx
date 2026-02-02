'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, Edit, Trash2, Building2 } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface Venue {
    id: string;
    name: string;
    address: string;
    description: string;
    sports: string[];
    images?: string[];
    courts?: any[];
}

export default function DashboardVenuesPage() {
    const router = useRouter();
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/venues/my-venues');
            setVenues(response.data);
        } catch (error) {
            console.error('Failed to fetch venues:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa sân này?')) return;

        try {
            await apiClient.delete(`/venues/${id}`);
            fetchVenues();
        } catch (error) {
            alert('Không thể xóa sân. Vui lòng thử lại.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">
                        Quản lý <span className="text-primary italic">Địa điểm</span>
                    </h1>
                    <p className="text-muted-foreground">Tạo và quản lý các địa điểm thể thao của bạn</p>
                </div>
                <Button className="rounded-xl font-bold shadow-lg" onClick={() => router.push('/venues/new')}>
                    <Plus className="h-5 w-5 mr-2" />
                    Thêm địa điểm
                </Button>
            </div>

            {venues.length === 0 ? (
                <div className="text-center py-20 glass-card rounded-3xl">
                    <Building2 className="h-20 w-20 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Chưa có địa điểm nào</h3>
                    <p className="text-muted-foreground mb-6">Bắt đầu thêm địa điểm đầu tiên của bạn</p>
                    <Button onClick={() => router.push('/venues/new')}>
                        <Plus className="h-5 w-5 mr-2" />
                        Thêm địa điểm ngay
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {venues.map((venue) => (
                        <div key={venue.id} className="glass-card rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-300">
                            <div className="h-48 bg-muted relative overflow-hidden">
                                {venue.images && venue.images.length > 0 ? (
                                    <>
                                        <img
                                            src={venue.images[0]}
                                            alt={venue.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
                                        <MapPin className="h-16 w-16 text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2 z-10">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="rounded-xl"
                                        onClick={() => router.push(`/venues/${venue.id}/edit`)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        className="rounded-xl"
                                        onClick={() => handleDelete(venue.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-bold mb-2 tracking-tight">{venue.name}</h3>
                                <div className="flex items-start gap-2 text-muted-foreground mb-4">
                                    <MapPin className="h-4 w-4 shrink-0 mt-1" />
                                    <p className="text-sm line-clamp-2">{venue.address}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {venue.sports?.map((sport, idx) => (
                                        <span key={idx} className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full font-bold uppercase">
                                            {sport}
                                        </span>
                                    ))}
                                </div>
                                <Button
                                    className="w-full rounded-xl font-bold"
                                    variant="outline"
                                    onClick={() => router.push(`/dashboard/courts?venueId=${venue.id}`)}
                                >
                                    Quản lý {venue.courts?.length || 0} sân đấu
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
