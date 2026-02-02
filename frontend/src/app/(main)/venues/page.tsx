'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/Pagination';
import { Loader2, Plus, MapPin, Search, Filter, Star, Clock } from 'lucide-react';
import { VenueCardSkeleton } from '@/components/skeletons';

interface Venue {
    id: string;
    name: string;
    address: string;
    description: string;
    sports?: string[];
    images?: string[];
}

export default function VenuesPage() {
    const router = useRouter();
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSport, setSelectedSport] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [user, setUser] = useState<any>(null);
    const itemsPerPage = 6;

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (error) {
                console.error('Failed to parse user data');
            }
        }
    }, []);

    const canCreateVenue = user?.role === 'VENUE_MANAGER' || user?.role === 'ADMIN';

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const res = await apiClient.get('/venues');
                setVenues(res.data);
            } catch (error) {
                console.error('Failed to fetch venues', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVenues();
    }, []);

    // Filter venues based on search and sport
    const filteredVenues = useMemo(() => {
        return venues.filter(venue => {
            const matchesSearch = searchQuery === '' ||
                venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                venue.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (venue.description && venue.description.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesSport = selectedSport === '' ||
                (venue.sports && venue.sports.includes(selectedSport));

            const matchesArea = selectedArea === '' ||
                venue.address.toLowerCase().includes(selectedArea.toLowerCase());

            // Lọc theo giá (giả định có trường price trong tương lai)
            const matchesPrice = selectedPrice === '';

            return matchesSearch && matchesSport && matchesArea && matchesPrice;
        });
    }, [venues, searchQuery, selectedSport, selectedArea, selectedPrice]);

    // Paginated venues
    const paginatedVenues = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredVenues.slice(startIndex, endIndex);
    }, [filteredVenues, currentPage]);

    const totalPages = Math.ceil(filteredVenues.length / itemsPerPage);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedSport, selectedArea, selectedPrice]);

    return (
        <div className="min-h-screen pb-20">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-900 border-b">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight mb-2">Tìm kiếm sân bãi</h1>
                            <p className="text-muted-foreground">Khám phá các sân thể thao chất lượng gần bạn</p>
                        </div>
                        {canCreateVenue && (
                            <Button onClick={() => router.push('/venues/new')} className="rounded-full shadow-lg hover:shadow-xl transition-all">
                                <Plus className="mr-2 h-4 w-4" /> Đăng ký sân mới
                            </Button>
                        )}
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-col gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm theo tên sân, địa chỉ..."
                                    className="pl-10 border-0 bg-white dark:bg-gray-900 shadow-sm h-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="default" className="md:w-32" onClick={() => { }}>
                                Tìm kiếm ({filteredVenues.length})
                            </Button>
                        </div>

                        {/* Filter Options */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <select
                                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={selectedSport}
                                onChange={(e) => setSelectedSport(e.target.value)}
                            >
                                <option value="">Tất cả môn</option>
                                <option value="PICKLEBALL">Pickleball</option>
                                <option value="TENNIS">Tennis</option>
                                <option value="BADMINTON">Badminton</option>
                                <option value="FOOTBALL">Bóng đá</option>
                            </select>
                            <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={selectedArea}
                                onChange={(e) => setSelectedArea(e.target.value)}
                            >
                                <option value="">Tất cả khu vực</option>
                                <option value="quận 7">Quận 7</option>
                                <option value="thủ đức">TP. Thủ Đức</option>
                                <option value="tân bình">Tân Bình</option>
                            </select>
                            <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={selectedPrice}
                                onChange={(e) => setSelectedPrice(e.target.value)}
                            >
                                <option value="">Mức giá</option>
                                <option value="low">Dưới 100k</option>
                                <option value="mid">100k - 300k</option>
                                <option value="high">Trên 300k</option>
                            </select>
                            <Button variant="outline" className="border-dashed">
                                <Filter className="mr-2 h-4 w-4" /> Bộ lọc nâng cao
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <VenueCardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredVenues.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-dashed">
                        <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">Chưa tìm thấy sân nào</h3>
                        <p className="text-muted-foreground mb-6">Hãy thử thay đổi bộ lọc{canCreateVenue ? ' hoặc tạo sân đầu tiên' : ''}</p>
                        {canCreateVenue && (
                            <Button onClick={() => router.push('/venues/new')}>Tạo sân mới</Button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedVenues.map((venue) => (
                                <div key={venue.id} className="group bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => router.push(`/venues/${venue.id}`)}>
                                    {/* Image */}
                                    <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 relative overflow-hidden">
                                        {venue.images && venue.images.length > 0 ? (
                                            <img
                                                src={venue.images[0]}
                                                alt={venue.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-gray-300" />
                                        )}
                                        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.5
                                        </div>
                                        <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> 05:00 - 23:00
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{venue.name}</h3>
                                        <div className="flex items-start text-muted-foreground text-sm mb-4 min-h-[40px]">
                                            <MapPin className="h-4 w-4 mr-1.5 mt-0.5 shrink-0 text-blue-500" />
                                            <span className="line-clamp-2">{venue.address}</span>
                                        </div>

                                        <div className="pt-4 border-t flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Giá từ</p>
                                                <p className="font-bold text-blue-600">100.000₫</p>
                                            </div>
                                            <Button size="sm" variant="secondary" className="rounded-full px-4">Đặt sân</Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                className="mt-8"
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
