'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/Pagination';
import { Loader2, Plus, Users, Calendar, MapPin, Swords } from 'lucide-react';
import { toast } from 'sonner';

interface Match {
    id: string;
    sport: string;
    level: string;
    startTime: string;
    maxPlayers: number;
    status: string;
    description: string;
    location: string;
    players: { id: string }[];
}

export default function MatchesPage() {
    const router = useRouter();
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const res = await apiClient.get('/matches');
                setMatches(res.data);
            } catch (error) {
                console.error('Failed to fetch matches', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    const handleJoinMatch = async (matchId: string, match: Match) => {
        try {
            // Check if match has expired
            const matchStartTime = new Date(match.startTime);
            const now = new Date();

            if (matchStartTime < now) {
                toast.error('Kèo đấu đã hết hạn tham gia');
                return;
            }

            // Check if match is full
            if (match.players && match.maxPlayers && match.players.length >= match.maxPlayers) {
                toast.error('Kèo đấu đã đủ người');
                return;
            }

            await apiClient.post(`/matches/${matchId}/join`);
            toast.success('Tham gia kèo thành công!');
            window.location.reload();
        } catch (error: any) {
            console.error('Failed to join match', error);
            toast.error(error.response?.data?.message || 'Không thể tham gia kèo này');
        }
    };

    // Paginated matches
    const paginatedMatches = matches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(matches.length / itemsPerPage);

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-2">
                                <Swords className="h-8 w-8 text-blue-600" /> Kèo đấu
                            </h1>
                            <p className="text-muted-foreground">Tìm kiếm đối thủ và đồng đội xứng tầm</p>
                        </div>
                        <Button onClick={() => router.push('/matches/new')} className="rounded-full shadow-lg hover:shadow-xl transition-all">
                            <Plus className="mr-2 h-4 w-4" /> Tạo kèo mới
                        </Button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center p-20">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                    </div>
                ) : matches.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-dashed">
                        <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Swords className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">Chưa có kèo nào</h3>
                        <p className="text-muted-foreground mb-6">Hãy là người đầu tiên tạo kèo đấu!</p>
                        <Button onClick={() => router.push('/matches/new')}>Tạo kèo ngay</Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedMatches.map((match) => (
                                <div key={match.id} className="bg-white dark:bg-gray-900 rounded-2xl border p-6 hover:shadow-xl transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-bold">
                                            {match.sport}
                                        </span>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded border ${match.status === 'OPEN' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500'}`}>
                                            {match.status}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{match.description || 'Giao lưu thể thao'}</h3>

                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-blue-500" />
                                            <span>{match.players.length} / {match.maxPlayers} người chơi</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-orange-500" />
                                            <span>{new Date(match.startTime).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-red-500" />
                                            <span>{match.location || 'Chưa xác định'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900 dark:text-white">Trình độ:</span>
                                            <span>{match.level}</span>
                                        </div>
                                    </div>

                                    <Button className="w-full" onClick={() => handleJoinMatch(match.id, match)} disabled={match.status !== 'OPEN'}>
                                        Tham gia ngay
                                    </Button>
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
