'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, X, Image as ImageIcon, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { LocationPicker } from '@/components/LocationPicker';

interface CreateVenueForm {
    name: string;
    address: string;
    description: string;
}

const AVAILABLE_SPORTS = [
    { value: 'PICKLEBALL', label: 'Pickleball' },
    { value: 'BADMINTON', label: 'Cầu lông' },
    { value: 'TENNIS', label: 'Tennis' },
    { value: 'FOOTBALL', label: 'Bóng đá' },
    { value: 'SOCCER', label: 'Bóng đá mini' },
];

export default function CreateVenuePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [selectedSports, setSelectedSports] = useState<string[]>(['PICKLEBALL', 'BADMINTON']);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    const { register, handleSubmit } = useForm<CreateVenueForm>();

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

    const onSubmit = async (data: CreateVenueForm) => {
        if (selectedSports.length === 0) {
            toast.error('Vui lòng chọn ít nhất 1 môn thể thao');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...data,
                sports: selectedSports,
                images: imageBase64 ? [imageBase64] : [],
                location: location
            };
            const response = await apiClient.post('/venues', payload);
            toast.success('Tạo địa điểm thành công! Bây giờ hãy thêm sân đấu.');
            // Redirect to courts management to add courts immediately
            router.push(`/dashboard/courts?venueId=${response.data.id}`);
        } catch (error) {
            console.error(error);
            toast.error('Tạo địa điểm thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Tạo địa điểm mới</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
                <div className="space-y-2">
                    <Label htmlFor="name">Tên địa điểm</Label>
                    <Input id="name" {...register('name', { required: true })} placeholder="Ví dụ: SportHub Complex" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input id="address" {...register('address', { required: true })} placeholder="123 Nguyễn Huệ, TP.HCM" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Mô tả</Label>
                    <Input id="description" {...register('description')} placeholder="Mô tả về sân..." />
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
                    <Label>Ảnh địa điểm (tùy chọn)</Label>
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

                {/* Location Picker */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Vị trí trên bản đồ (tùy chọn)
                    </Label>
                    <p className="text-sm text-muted-foreground mb-3">
                        Click trên bản đồ để chọn vị trí chính xác của địa điểm
                    </p>
                    <LocationPicker
                        onLocationChange={setLocation}
                        initialLocation={location || undefined}
                    />
                    {location && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                            ✓ Đã chọn vị trí: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" type="button" onClick={() => router.back()}>Hủy</Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Tạo sân
                    </Button>
                </div>
            </form>
        </div>
    );
}
