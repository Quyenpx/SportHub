'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateMatchForm {
    sport: string;
    level: string;
    maxPlayers: number;
    startTime: string;
    location: string;
    description: string;
}

export default function CreateMatchPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit } = useForm<CreateMatchForm>();

    const onSubmit = async (data: CreateMatchForm) => {
        setLoading(true);
        try {
            await apiClient.post('/matches', {
                ...data,
                maxPlayers: Number(data.maxPlayers),
                startTime: new Date(data.startTime).toISOString(),
                // Mock enum values if needed, assumes backend handles string matching or we ensure valid enums
            });
            router.push('/matches');
        } catch (error) {
            console.error(error);
            toast.error('Tạo kèo thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Tạo kèo đấu mới</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="sport">Môn thể thao</Label>
                        <select
                            id="sport"
                            {...register('sport')}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="PICKLEBALL">Pickleball</option>
                            <option value="SOCCER">Bóng đá</option>
                            <option value="BADMINTON">Cầu lông</option>
                            <option value="TENNIS">Tennis</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="level">Trình độ</Label>
                        <select
                            id="level"
                            {...register('level')}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="BEGINNER">Mới chơi</option>
                            <option value="INTERMEDIATE">Trung bình</option>
                            <option value="ADVANCED">Nâng cao</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location">Địa điểm (Sân)</Label>
                    <Input id="location" {...register('location', { required: true })} placeholder="Ví dụ: Sân số 1 SportHub" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="startTime">Thời gian</Label>
                        <Input id="startTime" type="datetime-local" {...register('startTime', { required: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maxPlayers">Số người tối đa</Label>
                        <Input id="maxPlayers" type="number" {...register('maxPlayers', { required: true, min: 2 })} placeholder="4" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Mô tả thêm</Label>
                    <Input id="description" {...register('description')} placeholder="Ví dụ: Cần tìm thêm 2 bạn đánh đôi..." />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" type="button" onClick={() => router.back()}>Hủy</Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Tạo kèo
                    </Button>
                </div>
            </form>
        </div>
    );
}
