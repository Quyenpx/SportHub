'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Check, X, Building2, Phone, Mail, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface VenueRequest {
    id: string;
    userId: string;
    status: string;
    businessName: string | null;
    businessPhone: string | null;
    note: string | null;
    createdAt: string;
    user: {
        id: string;
        email: string;
        fullName: string;
        phoneNumber: string;
        createdAt: string;
    };
}

export default function VenueRequestsPage() {
    const [requests, setRequests] = useState<VenueRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'PENDING' | 'ALL'>('PENDING');

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/admin/venue-requests', {
                params: filter === 'PENDING' ? { status: 'PENDING' } : {},
            });
            setRequests(res.data);
        } catch (error) {
            console.error('Failed to fetch requests', error);
            toast.error('Không thể tải danh sách yêu cầu');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId: string) => {
        try {
            await apiClient.put(`/admin/venue-requests/${requestId}/approve`);
            toast.success('Đã phê duyệt yêu cầu');
            fetchRequests();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Phê duyệt thất bại');
        }
    };

    const handleReject = async (requestId: string) => {
        const reason = prompt('Lý do từ chối (tùy chọn):');
        try {
            await apiClient.put(`/admin/venue-requests/${requestId}/reject`, {
                reason: reason || undefined,
            });
            toast.success('Đã từ chối yêu cầu');
            fetchRequests();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Từ chối thất bại');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black">Yêu cầu quản lý sân</h1>
                    <p className="text-muted-foreground mt-1">Phê duyệt các yêu cầu đăng ký quản lý sân</p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant={filter === 'PENDING' ? 'default' : 'outline'}
                        onClick={() => setFilter('PENDING')}
                    >
                        Chờ duyệt
                    </Button>
                    <Button
                        variant={filter === 'ALL' ? 'default' : 'outline'}
                        onClick={() => setFilter('ALL')}
                    >
                        Tất cả
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 animate-pulse">
                            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 text-center">
                    <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Không có yêu cầu nào</h3>
                    <p className="text-muted-foreground">
                        {filter === 'PENDING' ? 'Không có yêu cầu chờ duyệt' : 'Chưa có yêu cầu nào'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <div
                            key={request.id}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                                        <User className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{request.user.fullName}</h3>
                                        <p className="text-sm text-muted-foreground">{request.user.email}</p>
                                    </div>
                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${request.status === 'PENDING'
                                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400'
                                            : request.status === 'APPROVED'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                                        }`}
                                >
                                    {request.status === 'PENDING' ? 'Chờ duyệt' : request.status === 'APPROVED' ? 'Đã duyệt' : 'Đã từ chối'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{request.user.phoneNumber}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{new Date(request.createdAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>

                            {(request.businessName || request.businessPhone || request.note) && (
                                <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-4 mb-4">
                                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                        <Building2 className="h-4 w-4" />
                                        Thông tin kinh doanh
                                    </h4>
                                    {request.businessName && (
                                        <p className="text-sm mb-1">
                                            <strong>Tên:</strong> {request.businessName}
                                        </p>
                                    )}
                                    {request.businessPhone && (
                                        <p className="text-sm mb-1">
                                            <strong>SĐT:</strong> {request.businessPhone}
                                        </p>
                                    )}
                                    {request.note && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            <strong>Ghi chú:</strong> {request.note}
                                        </p>
                                    )}
                                </div>
                            )}

                            {request.status === 'PENDING' && (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleApprove(request.id)}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        Phê duyệt
                                    </Button>
                                    <Button
                                        onClick={() => handleReject(request.id)}
                                        variant="outline"
                                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Từ chối
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
