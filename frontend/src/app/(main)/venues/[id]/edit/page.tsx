'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface EditVenueForm {
    name: string;
    address: string;
    description: string;
}

interface Venue {
    id: string;
    name: string;
    address: string;
    description: string;
    images?: string[];
    sports?: string[];
}

const AVAILABLE_SPORTS = [
    { value: 'PICKLEBALL', label: 'Pickleball' },
    { value: 'BADMINTON', label: 'Cầu lông' },
    { value: 'TENNIS', label: 'Tennis' },
    { value: 'FOOTBALL', label: 'Bóng đá' },
    { value: 'SOCCER', label: 'Bóng đá mini' },
];

export default function EditVenuePage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [venue, setVenue] = useState<Venue | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [selectedSports, setSelectedSports] = useState<string[]>([]);

    const { register, handleSubmit, reset } = useForm<EditVenueForm>();

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                const res = await apiClient.get(`/venues/${params.id}`);
                setVenue(res.data);
                reset({
                    name: res.data.name,
                    address: res.data.address,
                    description: res.data.description || '',
                });

                // Set existing image if available
                if (res.data.images && res.data.images.length > 0) {
                    setImagePreview(res.data.images[0]);
                }

                // Set existing sports
                if (res.data.sports && res.data.sports.length > 0) {
                    setSelectedSports(res.data.sports);
                }
            } catch (error) {
                console.error('Không thể tải thông tin sân', error);
                toast.error('Không thể tải thông tin sân');
                router.push('/venues');
            } finally {
                setFetching(false);
            }
        };

        if (params.id) fetchVenue();
    }, [params.id, reset, router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 5MB for original file)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Kích thước ảnh tối đa 5MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file ảnh');
            return;
        }

        // Compress and convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
                // Create canvas to resize image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Calculate new dimensions (max 800px width/height)
                let width = img.width;
                let height = img.height;
                const maxSize = 800;

                if (width > height && width > maxSize) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                } else if (height > maxSize) {
                    width = (width * maxSize) / height;
                    height = maxSize;
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx?.drawImage(img, 0, 0, width, height);

                // Convert to base64 with compression (0.7 quality for JPEG)
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

                setImageBase64(compressedBase64);
                setImagePreview(compressedBase64);

                toast.success('Ảnh đã được tải lên và nén');
            };
            img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        setImageBase64(null);
    };

    const toggleSport = (sport: string) => {
        setSelectedSports(prev => {
            if (prev.includes(sport)) {
                // Không cho phép bỏ chọn nếu chỉ còn 1 môn
                if (prev.length === 1) {
                    toast.error('Phải chọn ít nhất 1 môn thể thao');
                    return prev;
                }
                return prev.filter(s => s !== sport);
            } else {
                return [...prev, sport];
            }
        });
    };

    const onSubmit = async (data: EditVenueForm) => {
        if (selectedSports.length === 0) {
            toast.error('Vui lòng chọn ít nhất 1 môn thể thao');
            return;
        }

        setLoading(true);
        try {
            const payload: any = {
                ...data,
                sports: selectedSports,
            };

            // Only update images if a new image was uploaded
            if (imageBase64) {
                payload.images = [imageBase64];
            }

            await apiClient.put(`/venues/${params.id}`, payload);
            toast.success('Cập nhật sân thành công!');
            router.push(`/venues/${params.id}`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Cập nhật sân thất bại');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" />
            </div>
        );
    }

    if (!venue) {
        return (
            <div className="container mx-auto py-10 px-4 max-w-2xl">
                <p className="text-center text-muted-foreground">Không tìm thấy sân</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-6"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
            </Button>

            <h1 className="text-3xl font-bold mb-6">Chỉnh sửa thông tin sân</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
                <div className="space-y-2">
                    <Label htmlFor="name">Tên sân</Label>
                    <Input
                        id="name"
                        {...register('name', { required: true })}
                        placeholder="Ví dụ: SportHub Complex"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                        id="address"
                        {...register('address', { required: true })}
                        placeholder="123 Nguyễn Huệ, TP.HCM"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Mô tả</Label>
                    <textarea
                        id="description"
                        {...register('description')}
                        placeholder="Mô tả về sân..."
                        className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                {/* Sports Selection */}
                <div className="space-y-2">
                    <Label>Môn thể thao</Label>
                    <p className="text-sm text-muted-foreground mb-3">Chọn các môn thể thao có sẵn tại sân</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {AVAILABLE_SPORTS.map((sport) => (
                            <button
                                key={sport.value}
                                type="button"
                                onClick={() => toggleSport(sport.value)}
                                className={`
                                    px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all
                                    ${selectedSports.includes(sport.value)
                                        ? 'border-primary bg-primary text-primary-foreground shadow-md'
                                        : 'border-gray-300 dark:border-gray-600 bg-background hover:border-primary/50'
                                    }
                                `}
                            >
                                {sport.label}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Đã chọn: {selectedSports.length} môn
                    </p>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                    <Label>Ảnh sân</Label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                        {imagePreview ? (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2 rounded-full"
                                    onClick={removeImage}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    <span className="text-primary hover:text-primary/80 font-medium">
                                        Tải ảnh lên
                                    </span>
                                    <span className="text-muted-foreground"> hoặc kéo thả</span>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                                <p className="text-xs text-muted-foreground mt-2">PNG, JPG tối đa 5MB (sẽ tự động nén)</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => router.back()}
                    >
                        Hủy
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Lưu thay đổi
                    </Button>
                </div>
            </form>
        </div>
    );
}
