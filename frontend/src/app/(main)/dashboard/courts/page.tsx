'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, ArrowLeft, Activity, DollarSign, Edit, Trash2 } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { SportIcon, getSportConfig, getSportName } from '@/components/sport-icon';
import { toast } from 'sonner';

interface Court {
    id: string;
    name: string;
    type: string;
    pricePerHour: number;
}

export default function DashboardCourtsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const venueId = searchParams.get('venueId');

    const [courts, setCourts] = useState<Court[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingCourt, setEditingCourt] = useState<Court | null>(null);
    const [newCourt, setNewCourt] = useState({
        name: '',
        type: 'PICKLEBALL',
        pricePerHour: 0
    });
    const [availableHours, setAvailableHours] = useState({
        monday: { enabled: true, start: '08:00', end: '22:00' },
        tuesday: { enabled: true, start: '08:00', end: '22:00' },
        wednesday: { enabled: true, start: '08:00', end: '22:00' },
        thursday: { enabled: true, start: '08:00', end: '22:00' },
        friday: { enabled: true, start: '08:00', end: '22:00' },
        saturday: { enabled: true, start: '08:00', end: '22:00' },
        sunday: { enabled: true, start: '08:00', end: '22:00' },
    });

    useEffect(() => {
        if (venueId) {
            fetchCourts();
        }
    }, [venueId]);

    const fetchCourts = async () => {
        try {
            const response = await apiClient.get(`/courts/venue/${venueId}`);
            setCourts(response.data);
        } catch (error) {
            console.error('Failed to fetch courts', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCourt = async (e: React.FormEvent) => {
        e.preventDefault();

        // Chuẩn bị dữ liệu giờ hoạt động
        const hours: any = {};
        Object.entries(availableHours).forEach(([day, config]) => {
            if (config.enabled) {
                hours[day] = `${config.start}-${config.end}`;
            }
        });

        try {
            await apiClient.post('/courts', {
                ...newCourt,
                venueId,
                pricePerHour: parseFloat(newCourt.pricePerHour.toString()),
                availableHours: hours
            });

            toast.success('Thêm sân thành công!');
            setShowAddForm(false);
            setNewCourt({ name: '', type: 'PICKLEBALL', pricePerHour: 0 });
            // Reset giờ hoạt động về default
            setAvailableHours({
                monday: { enabled: true, start: '08:00', end: '22:00' },
                tuesday: { enabled: true, start: '08:00', end: '22:00' },
                wednesday: { enabled: true, start: '08:00', end: '22:00' },
                thursday: { enabled: true, start: '08:00', end: '22:00' },
                friday: { enabled: true, start: '08:00', end: '22:00' },
                saturday: { enabled: true, start: '08:00', end: '22:00' },
                sunday: { enabled: true, start: '08:00', end: '22:00' },
            });
            fetchCourts();
        } catch (error: any) {
            console.error('Add court error:', error);
            toast.error(error.response?.data?.message || 'Không thể thêm sân. Vui lòng thử lại.');
        }
    };

    const handleEdit = (court: Court) => {
        setEditingCourt(court);
        setNewCourt({
            name: court.name,
            type: court.type,
            pricePerHour: court.pricePerHour
        });
        setShowAddForm(false);
    };

    const handleUpdateCourt = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCourt) return;

        try {
            await apiClient.put(`/courts/${editingCourt.id}`, {
                name: newCourt.name,
                type: newCourt.type,
                pricePerHour: parseFloat(newCourt.pricePerHour.toString()),
            });

            toast.success('Cập nhật sân thành công!');
            setEditingCourt(null);
            setNewCourt({ name: '', type: 'PICKLEBALL', pricePerHour: 0 });
            fetchCourts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Không thể cập nhật sân. Vui lòng thử lại.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa sân này?')) return;

        try {
            await apiClient.delete(`/courts/${id}`);
            toast.success('Xóa sân thành công!');
            fetchCourts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Không thể xóa sân. Vui lòng thử lại.');
        }
    };

    if (!venueId) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-muted-foreground">Vui lòng chọn một venue để quản lý sân.</p>
            </div>
        );
    }

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
                <Button variant="ghost" onClick={() => router.push('/dashboard/venues')} className="mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                </Button>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter mb-2">
                            Quản lý <span className="text-primary italic">Sân đấu</span>
                        </h1>
                        <p className="text-muted-foreground">Các sân đấu trong địa điểm này</p>
                    </div>
                    <Button
                        className="rounded-xl font-bold"
                        onClick={() => {
                            setShowAddForm(!showAddForm);
                            setEditingCourt(null);
                        }}
                        disabled={editingCourt !== null}
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Thêm sân đấu
                    </Button>
                </div>
            </div>

            {(showAddForm || editingCourt) && (
                <div className="glass-card rounded-3xl p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6">
                        {editingCourt ? 'Chỉnh sửa sân đấu' : 'Thêm sân đấu mới'}
                    </h2>
                    <form onSubmit={editingCourt ? handleUpdateCourt : handleAddCourt}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="name">Tên sân đấu</Label>
                                <Input
                                    id="name"
                                    value={newCourt.name}
                                    onChange={(e) => setNewCourt({ ...newCourt, name: e.target.value })}
                                    required
                                    className="rounded-xl"
                                />
                            </div>
                            <div>
                                <Label htmlFor="type">Loại sân đấu</Label>
                                <select
                                    id="type"
                                    value={newCourt.type}
                                    onChange={(e) => setNewCourt({ ...newCourt, type: e.target.value })}
                                    className="w-full border rounded-xl px-3 py-2.5 bg-background"
                                >
                                    <option value="PICKLEBALL">Pickleball</option>
                                    <option value="TENNIS">Tennis</option>
                                    <option value="BADMINTON">Badminton</option>
                                    <option value="FOOTBALL">Bóng đá</option>
                                    <option value="SOCCER">Bóng đá mini</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="pricePerHour">Giá theo giờ (VNĐ)</Label>
                                <Input
                                    id="pricePerHour"
                                    type="number"
                                    value={newCourt.pricePerHour}
                                    onChange={(e) => setNewCourt({ ...newCourt, pricePerHour: parseFloat(e.target.value) })}
                                    required
                                    className="rounded-xl"
                                />
                            </div>
                        </div>

                        {!editingCourt && (
                            <div className="mt-6">
                                <Label className="mb-3 block">Giờ hoạt động</Label>
                                <div className="space-y-3">
                                    {Object.entries(availableHours).map(([day, config]) => {
                                        const dayNames: Record<string, string> = {
                                            monday: 'Thứ 2',
                                            tuesday: 'Thứ 3',
                                            wednesday: 'Thứ 4',
                                            thursday: 'Thứ 5',
                                            friday: 'Thứ 6',
                                            saturday: 'Thứ 7',
                                            sunday: 'Chủ nhật',
                                        };

                                        return (
                                            <div key={day} className="flex items-center gap-3 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={config.enabled}
                                                    onChange={(e) => setAvailableHours({
                                                        ...availableHours,
                                                        [day]: { ...config, enabled: e.target.checked }
                                                    })}
                                                    className="h-4 w-4"
                                                />
                                                <span className="w-20 font-medium">{dayNames[day as keyof typeof dayNames]}</span>
                                                {config.enabled && (
                                                    <>
                                                        <Input
                                                            type="time"
                                                            value={config.start}
                                                            onChange={(e) => setAvailableHours({
                                                                ...availableHours,
                                                                [day]: { ...config, start: e.target.value }
                                                            })}
                                                            className="w-28 h-8 rounded-lg"
                                                        />
                                                        <span>-</span>
                                                        <Input
                                                            type="time"
                                                            value={config.end}
                                                            onChange={(e) => setAvailableHours({
                                                                ...availableHours,
                                                                [day]: { ...config, end: e.target.value }
                                                            })}
                                                            className="w-28 h-8 rounded-lg"
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 mt-6">
                            <Button type="submit" className="rounded-xl">
                                {editingCourt ? 'Cập nhật sân đấu' : 'Thêm sân đấu'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-xl"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setEditingCourt(null);
                                    setNewCourt({ name: '', type: 'PICKLEBALL', pricePerHour: 0 });
                                }}
                            >
                                Hủy
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courts.map((court) => {
                    const sportConfig = getSportConfig(court.type);
                    const SportIconComponent = sportConfig.icon;

                    return (
                        <div key={court.id} className="glass-card rounded-3xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 ${sportConfig.bgColor} rounded-2xl`}>
                                    <SportIconComponent className={`h-6 w-6 ${sportConfig.color}`} />
                                </div>
                                <span className="text-xs px-3 py-1 bg-secondary rounded-full font-bold uppercase">{getSportName(court.type)}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{court.name}</h3>
                            <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-sm font-medium">{court.pricePerHour.toLocaleString()} VNĐ/giờ</span>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 rounded-xl"
                                    onClick={() => handleEdit(court)}
                                    disabled={editingCourt !== null || showAddForm}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Sửa
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="rounded-xl"
                                    onClick={() => handleDelete(court.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {courts.length === 0 && !showAddForm && (
                <div className="text-center py-20 glass-card rounded-3xl">
                    <Activity className="h-20 w-20 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Chưa có sân đấu</h3>
                    <p className="text-muted-foreground mb-6">Thêm sân đấu để bắt đầu nhận booking</p>
                    <Button onClick={() => setShowAddForm(true)}>
                        <Plus className="h-5 w-5 mr-2" />
                        Thêm sân đấu đầu tiên
                    </Button>
                </div>
            )}
        </div>
    );
}
