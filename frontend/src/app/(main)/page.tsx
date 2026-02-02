'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/Pagination';
import { ArrowRight, Trophy, Calendar, Users, Star, MapPin, Activity, Zap } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface Venue {
    id: string;
    name: string;
    address: string;
    description: string;
    images?: string[];
}

interface Match {
    id: string;
    sport: string;
    description: string;
    status: string;
    maxPlayers: number;
    players: any[];
}

export default function HomePage() {
    const mockVenues: Venue[] = [
        { id: 'mock1', name: 'Sân Pickleball Quận 7', address: '123 Nguyễn Văn Linh, Q.7, TP.HCM', description: 'Sân đẹp, thoáng mát, thảm mới 100%' },
        { id: 'mock2', name: 'Sân Cầu lông SportHub', address: '456 Lê Văn Việt, Q.9, TP.HCM', description: 'Sân chất lượng cao, ánh sáng tiêu chuẩn' },
        { id: 'mock3', name: 'Sân Bóng đá K300', address: 'K300 Cộng Hòa, Tân Bình, TP.HCM', description: 'Cỏ nhân tạo mới, có căn tin' },
    ];

    const mockMatches: Match[] = [
        { id: 'mock1', sport: 'PICKLEBALL', description: 'Kèo giao lưu trình độ 3.0', status: 'OPEN', maxPlayers: 4, players: [1, 2] },
        { id: 'mock2', sport: 'SOCCER', description: 'Đá 7 người, thiếu thủ môn', status: 'OPEN', maxPlayers: 14, players: [1, 2, 3, 4, 5] },
        { id: 'mock3', sport: 'BADMINTON', description: 'Đánh đôi nam nữ vãng lai', status: 'OPEN', maxPlayers: 4, players: [1] },
    ];

    const [venues, setVenues] = useState<Venue[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentVenuePage, setCurrentVenuePage] = useState(1);
    const [currentMatchPage, setCurrentMatchPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [venuesRes, matchesRes] = await Promise.all([
                    apiClient.get('/venues'),
                    apiClient.get('/matches'),
                ]);

                const realVenues = venuesRes.data || [];
                const realMatches = matchesRes.data || [];

                // Luôn hiển thị real data nếu có, không fallback về mock
                setVenues(realVenues);
                setMatches(realMatches.filter((m: Match) => m.status === 'OPEN'));
            } catch (error) {
                console.error('Failed to fetch data, using mock data', error);
                // Chỉ dùng mock data khi API lỗi hoàn toàn
                setVenues(mockVenues);
                setMatches(mockMatches);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden mesh-gradient">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md animate-fade-in">
                            <Zap className="h-4 w-4 fill-primary animate-pulse" />
                            <span>Trải nghiệm thể thao thế hệ mới</span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase animate-in slide-in-from-bottom-8 duration-700">
                                Đánh thức <br />
                                <span className="text-primary italic">Năng lượng</span> bên trong
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed animate-in slide-in-from-bottom-10 duration-1000">
                                Nền tảng đặt sân & kết nối cộng đồng thể thao hàng đầu. Nhanh chóng, chuyên nghiệp và đầy cảm hứng.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-in slide-in-from-bottom-12 duration-1000">
                            <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/20 group overflow-hidden relative" asChild>
                                <Link href="/venues">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Bắt đầu ngay <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold rounded-2xl border-2 glass-card hover:bg-white/10" asChild>
                                <Link href="/matches">Tham gia kèo</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                {/* Decorative Elements */}
                <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px] -z-10 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[150px] -z-10"></div>

                {/* Background Text Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-between px-20 opacity-[0.03] select-none pointer-events-none -z-20 font-black text-[20vw] uppercase leading-none text-border">
                    <span>Play</span>
                    <span>Win</span>
                </div>
            </section>

            {/* Featured Venues */}
            <section className="py-24 relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-400/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3"></div>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="space-y-2">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Địa điểm <span className="text-primary italic">Hot</span></h2>
                            <p className="text-lg text-muted-foreground border-l-4 border-primary pl-4">Hệ thống sân bãi đạt chuẩn quốc tế tại TP.HCM</p>
                        </div>
                        <Button variant="link" asChild className="text-primary font-bold text-lg group">
                            <Link href="/venues" className="flex items-center gap-2">
                                Xem tất cả <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {venues.slice((currentVenuePage - 1) * itemsPerPage, currentVenuePage * itemsPerPage).map((venue, idx) => {
                            // Sport-themed images
                            const sportImages = [
                                'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop', // Pickleball court
                                'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=600&fit=crop', // Badminton court
                                'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop', // Soccer field
                            ];

                            return (
                                <div key={venue.id} className="group glass-card rounded-3xl overflow-hidden hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2">
                                    <div className="h-64 bg-muted relative overflow-hidden">
                                        <img
                                            src={venue.images && venue.images.length > 0 ? venue.images[0] : sportImages[idx % 3]}
                                            alt={venue.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <p className="text-white text-sm font-medium">{venue.description}</p>
                                        </div>
                                        <div className="absolute top-4 right-4 bg-primary/90 text-white text-[10px] font-black px-3 py-1 rounded-full z-20 uppercase tracking-widest shadow-lg">
                                            Premium
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="font-bold text-2xl mb-3 tracking-tight group-hover:text-primary transition-colors">{venue.name}</h3>
                                        <div className="flex items-start gap-2 text-muted-foreground mb-6">
                                            <MapPin className="h-4 w-4 shrink-0 mt-1" />
                                            <p className="text-sm line-clamp-2">{venue.address}</p>
                                        </div>
                                        <Button className="w-full h-12 rounded-xl font-bold glow-on-hover" variant="secondary" asChild>
                                            <Link href={`/venues/${venue.id}`}>Đặt sân ngay</Link>
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {venues.length > itemsPerPage && (
                        <Pagination
                            currentPage={currentVenuePage}
                            totalPages={Math.ceil(venues.length / itemsPerPage)}
                            onPageChange={setCurrentVenuePage}
                            className="mt-12"
                        />
                    )}
                </div>
            </section>

            {/* CTA/Stats Section */}
            <section className="py-20 relative overflow-hidden bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: 'Người dùng', val: '50,000+' },
                            { label: 'Sân đấu', val: '1,200+' },
                            { label: 'Kèo đấu mỗi ngày', val: '300+' },
                            { label: 'Thành phố', val: '10+' },
                        ].map((stat, i) => (
                            <div key={i} className="space-y-1">
                                <div className="text-4xl md:text-5xl font-black italic">{stat.val}</div>
                                <div className="text-primary-foreground/70 uppercase text-xs font-bold tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] translate-x-1/2"></div>
            </section>

            {/* Active Matches */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-primary/5 via-transparent to-primary/5 -z-10"></div>
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-green-400/20 rounded-full blur-[120px] -z-10 -translate-x-1/4 -translate-y-1/4"></div>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="space-y-2">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Kèo đấu <span className="text-primary italic">Trực tiếp</span></h2>
                            <p className="text-lg text-muted-foreground border-l-4 border-primary pl-4">Kết nối đam mê, tìm kiếm đồng đội ngay lập tức</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {matches.slice((currentMatchPage - 1) * itemsPerPage, currentMatchPage * itemsPerPage).map((match) => (
                            <div key={match.id} className="p-8 rounded-3xl border border-border bg-card hover:border-primary/50 transition-all duration-300 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-0 group-hover:scale-110 transition-transform"></div>
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="p-3 bg-primary/10 rounded-2xl">
                                        <Activity className="h-6 w-6 text-primary" />
                                    </div>
                                    <span className="text-[10px] px-3 py-1 bg-green-500 text-white rounded-full font-black uppercase tracking-widest">Live</span>
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <div>
                                        <span className="text-primary font-black text-xs uppercase tracking-widest">{match.sport}</span>
                                        <h3 className="font-bold text-xl mt-1 tracking-tight">{match.description || 'Giao lưu thể thao'}</h3>
                                    </div>
                                    <div className="flex items-center gap-3 text-muted-foreground font-medium">
                                        <div className="flex -space-x-2">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">U{i + 1}</div>
                                            ))}
                                        </div>
                                        <span className="text-sm">{match.players.length} / {match.maxPlayers} slot</span>
                                    </div>
                                    <Button className="w-full h-12 rounded-xl font-bold group" asChild>
                                        <Link href="/matches" className="flex items-center justify-center gap-2">
                                            Tham gia <Zap className="h-4 w-4 fill-current group-hover:scale-125 transition-transform" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {matches.length > itemsPerPage && (
                        <Pagination
                            currentPage={currentMatchPage}
                            totalPages={Math.ceil(matches.length / itemsPerPage)}
                            onPageChange={setCurrentMatchPage}
                            className="mt-12"
                        />
                    )}
                </div>
            </section>
        </div>
    );
}

