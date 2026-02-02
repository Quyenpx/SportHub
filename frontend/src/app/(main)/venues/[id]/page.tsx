'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, MapPin, Clock, Star, CheckCircle, Calendar as CalendarIcon, X, Navigation, Phone } from 'lucide-react';
import { SportIcon, getSportName } from '@/components/sport-icon';
import { VenueMapViewer } from '@/components/VenueMapViewer';

interface Court {
    id: string;
    name: string;
    type: string;
    pricePerHour: string;
}

interface Venue {
    id: string;
    name: string;
    address: string;
    description: string;
    location?: { lat: number; lng: number };
    courts: Court[];
    owner?: {
        id: string;
        fullName: string;
        email: string;
        phoneNumber?: string;
    };
}

export default function VenueDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [venue, setVenue] = useState<Venue | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

    // Booking Form State
    const [bookingDate, setBookingDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                const res = await apiClient.get(`/venues/${params.id}`);
                setVenue(res.data);
            } catch (error) {
                console.error('Failed to fetch venue', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) fetchVenue();
    }, [params.id]);

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourt || !bookingDate || !startTime || !endTime) return;

        setBookingLoading(true);
        try {
            // Construct ISO strings
            const startDateTime = new Date(`${bookingDate}T${startTime}:00`).toISOString();
            const endDateTime = new Date(`${bookingDate}T${endTime}:00`).toISOString();

            await apiClient.post('/bookings', {
                courtId: selectedCourt.id,
                startTime: startDateTime,
                endTime: endDateTime,
            });

            alert('Đặt sân thành công!');
            setSelectedCourt(null); // Close modal
            // Reset form
            setStartTime('');
            setEndTime('');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Đặt sân thất bại (Có thể do trùng giờ)');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
    if (!venue) return <div className="p-8 text-center text-muted-foreground">Không tìm thấy sân.</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
            {/* Hero Banner */}
            <div className="h-64 md:h-80 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 relative z-10 text-white">
                    <h1 className="text-3xl md:text-5xl font-black mb-2">{venue.name}</h1>
                    <div className="flex items-center gap-4 text-sm md:text-base opacity-90">
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {venue.address}</span>
                        <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> 4.8 (120 đánh giá)</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Description */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Giới thiệu</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {venue.description || 'Sân thể thao chất lượng cao, đầy đủ tiện nghi, phục vụ 24/7.'}
                        </p>

                        <div className="mt-6 flex gap-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                                <CheckCircle className="h-5 w-5" /> Wifi miễn phí
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                                <CheckCircle className="h-5 w-5" /> Bãi giữ xe
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                                <CheckCircle className="h-5 w-5" /> Căn tin
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    {venue.location && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Vị trí</h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${venue.location!.lat},${venue.location!.lng}`, '_blank')}
                                >
                                    <Navigation className="h-4 w-4 mr-2" />
                                    Chỉ đường
                                </Button>
                            </div>
                            <div className="h-64 md:h-80 w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <VenueMapViewer
                                    location={venue.location}
                                    venueName={venue.name}
                                />
                            </div>
                            <p className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
                                <MapPin className="h-4 w-4 shrink-0" />
                                {venue.address}
                            </p>
                        </div>
                    )}

                    {/* Courts List */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Danh sách sân đấu</h2>
                        <div className="space-y-4">
                            {venue.courts.length > 0 ? venue.courts.map((court) => (
                                <div key={court.id} className="bg-white dark:bg-gray-900 rounded-xl p-4 border flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-blue-500 transition-colors">
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <SportIcon type={court.type} className="h-16 w-16 rounded-lg" />
                                        <div>
                                            <h3 className="font-bold text-lg">{court.name}</h3>
                                            <p className="text-sm text-muted-foreground">{getSportName(court.type)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="text-right">
                                            <div className="font-bold text-blue-600 text-lg">{Number(court.pricePerHour).toLocaleString()}₫</div>
                                            <div className="text-xs text-muted-foreground">/ giờ</div>
                                        </div>
                                        <Button onClick={() => setSelectedCourt(court)}>Đặt sân</Button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-muted-foreground text-center py-8">Chưa có sân đấu nào. (Liên hệ chủ địa điểm)</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info (Mock) */}
                <div className="hidden lg:block space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border sticky top-24">
                        <h3 className="font-bold mb-4">Giờ mở cửa</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Thứ 2 - Thứ 6</span>
                                <span>05:00 - 23:00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Thứ 7 - CN</span>
                                <span>05:00 - 23:00</span>
                            </div>
                        </div>
                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-4"></div>
                        <h3 className="font-bold mb-4">Liên hệ</h3>
                        {venue.owner?.phoneNumber ? (
                            <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <a href={`tel:${venue.owner.phoneNumber}`} className="hover:text-primary transition-colors font-medium">
                                    {venue.owner.phoneNumber}
                                </a>
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground mb-4">Liên hệ trực tiếp tại sân</p>
                        )}
                        <Button variant="outline" className="w-full">Gọi ngay</Button>
                    </div>
                </div>
            </div>

            {/* Booking Modal (Overlay) */}
            {selectedCourt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold">Đặt sân: {selectedCourt.name}</h3>
                                <p className="text-sm text-muted-foreground">Giá: {Number(selectedCourt.pricePerHour).toLocaleString()}₫ / giờ</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedCourt(null)}><X className="h-5 w-5" /></Button>
                        </div>

                        <form onSubmit={handleBooking} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Ngày đặt</Label>
                                <Input type="date" required value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Giờ bắt đầu</Label>
                                    <Input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Giờ kết thúc</Label>
                                    <Input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="h-4 w-4" /> Lưu ý
                                </div>
                                Vui lòng đến sớm 10 phút để nhận sân. Hủy sân trước 2 tiếng để được hoàn tiền.
                            </div>

                            <Button type="submit" className="w-full" disabled={bookingLoading}>
                                {bookingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Xác nhận đặt sân
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
