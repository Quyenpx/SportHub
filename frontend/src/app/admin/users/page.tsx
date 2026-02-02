'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Ban, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface User {
    id: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    role: string;
    status: string;
    provider: string;
    createdAt: string;
}

export default function UsersManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');

    useEffect(() => {
        fetchUsers();
    }, [roleFilter, statusFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (roleFilter) params.role = roleFilter;
            if (statusFilter) params.status = statusFilter;

            const res = await apiClient.get('/admin/users', { params });
            setUsers(res.data.users || []);
        } catch (error) {
            console.error('Failed to fetch users', error);
            toast.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (userId: string, newStatus: string) => {
        try {
            await apiClient.put(`/admin/users/${userId}/status`, { status: newStatus });
            toast.success(`Đã cập nhật trạng thái người dùng`);
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại');
        }
    };

    const filteredUsers = users.filter((user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        const colors: any = {
            ADMIN: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
            VENUE_MANAGER: 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
            PLAYER: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
        };
        return colors[role] || 'bg-gray-100 text-gray-700';
    };

    const getStatusBadge = (status: string) => {
        const colors: any = {
            ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
            PENDING: 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400',
            REJECTED: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
            SUSPENDED: 'bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black">Quản lý người dùng</h1>
                <p className="text-muted-foreground mt-1">Quản lý tất cả người dùng trong hệ thống</p>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm theo tên hoặc email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 border rounded-lg"
                    >
                        <option value="">Tất cả vai trò</option>
                        <option value="PLAYER">Người chơi</option>
                        <option value="VENUE_MANAGER">Quản lý sân</option>
                        <option value="ADMIN">Admin</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border rounded-lg"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="PENDING">Chờ duyệt</option>
                        <option value="SUSPENDED">Tạm khóa</option>
                        <option value="REJECTED">Đã từ chối</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            {loading ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="p-6 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4 animate-pulse">
                                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 text-center">
                    <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Không tìm thấy người dùng</h3>
                    <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Người dùng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Vai trò
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Ngày tạo
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-semibold">{user.fullName}</div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                                <div className="text-xs text-muted-foreground">{user.phoneNumber}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)}`}>
                                                {user.role === 'PLAYER' ? 'Người chơi' : user.role === 'VENUE_MANAGER' ? 'Quản lý sân' : 'Admin'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(user.status)}`}>
                                                {user.status === 'ACTIVE' ? 'Hoạt động' : user.status === 'PENDING' ? 'Chờ duyệt' : user.status === 'SUSPENDED' ? 'Tạm khóa' : 'Từ chối'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {user.status === 'ACTIVE' && user.role !== 'ADMIN' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleUpdateStatus(user.id, 'SUSPENDED')}
                                                        className="text-orange-600 border-orange-200 hover:bg-orange-50"
                                                    >
                                                        <Ban className="h-3 w-3 mr-1" />
                                                        Khóa
                                                    </Button>
                                                )}
                                                {user.status === 'SUSPENDED' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleUpdateStatus(user.id, 'ACTIVE')}
                                                        className="text-green-600 border-green-200 hover:bg-green-50"
                                                    >
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Mở khóa
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="text-sm text-muted-foreground text-center">
                Hiển thị {filteredUsers.length} người dùng
            </div>
        </div>
    );
}
