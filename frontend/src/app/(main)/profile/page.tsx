'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Calendar, Shield, Edit2, Save, X, Phone, Key, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

interface UserProfile {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
    role: string;
    provider: string;
    avatarUrl?: string;
    createdAt: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        avatarUrl: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get('/users/profile');
            setProfile(response.data);
            setFormData({
                fullName: response.data.fullName,
                phoneNumber: response.data.phoneNumber || '',
                avatarUrl: response.data.avatarUrl || ''
            });
        } catch (error: any) {
            console.error('Failed to fetch profile', error);
            console.error('Error response:', error.response);

            // Chỉ redirect về login nếu là lỗi 401 (Unauthorized)
            if (error.response?.status === 401) {
                router.push('/login');
            } else {
                // Các lỗi khác (500, network, etc.) không redirect
                toast.error('Không thể tải thông tin profile. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await apiClient.put('/users/me', {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber
            });
            setEditing(false);
            fetchProfile();
        } catch (error) {
            toast.error('Không thể cập nhật profile. Vui lòng thử lại.');
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Mật khẩu mới không khớp');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        try {
            setChangingPassword(true);
            await apiClient.put('/users/me/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            toast.success('Đổi mật khẩu thành công');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Không thể đổi mật khẩu');
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-4xl font-black tracking-tighter mb-2">
                    Hồ sơ <span className="text-primary italic">cá nhân</span>
                </h1>
                <p className="text-muted-foreground">Quản lý thông tin tài khoản của bạn</p>
            </div>

            <div className="glass-card rounded-3xl p-8">
                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-4xl border-4 border-background shadow-xl">
                            {profile.avatarUrl ? (
                                <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <User className="h-12 w-12 text-primary" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black tracking-tight mb-1">{profile.fullName}</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full font-bold uppercase">
                                    {profile.role}
                                </span>
                                <span className="text-xs px-3 py-1 bg-secondary rounded-full font-medium">
                                    {profile.provider}
                                </span>
                            </div>
                        </div>
                    </div>
                    {!editing && (
                        <Button onClick={() => setEditing(true)} className="rounded-xl">
                            <Edit2 className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                        </Button>
                    )}
                </div>

                {editing ? (
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Họ và tên</Label>
                                <Input
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="rounded-xl"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                                <Input
                                    id="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="rounded-xl"
                                    placeholder="0123456789"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="avatarUrl">Ảnh đại diện URL</Label>
                                <Input
                                    id="avatarUrl"
                                    value={formData.avatarUrl}
                                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                                    className="rounded-xl"
                                    placeholder="https://example.com/avatar.jpg"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button type="submit" className="rounded-xl">
                                <Save className="h-4 w-4 mr-2" />
                                Lưu thay đổi
                            </Button>
                            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setEditing(false)}>
                                <X className="h-4 w-4 mr-2" />
                                Hủy
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </div>
                                <p className="text-lg font-medium">{profile.email}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                    <Phone className="h-4 w-4" />
                                    Số điện thoại
                                </div>
                                <p className="text-lg font-medium">{profile.phoneNumber || 'Chưa cập nhật'}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                    <Calendar className="h-4 w-4" />
                                    Ngày tạo
                                </div>
                                <p className="text-lg font-medium">
                                    {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Change Password - Only for local users */}
            {!profile.provider || profile.provider === 'local' ? (
                <div className="glass-card rounded-3xl p-8 mt-6">
                    <h2 className="text-2xl font-bold mb-6">Đổi mật khẩu</h2>
                    <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="pl-10 rounded-xl"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Mật khẩu mới</Label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="pl-10 rounded-xl"
                                    required
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Tối thiểu 6 ký tự</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="pl-10 rounded-xl"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="rounded-xl" disabled={changingPassword}>
                            {changingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Đổi mật khẩu
                        </Button>
                    </form>
                </div>
            ) : null}

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                    variant="outline"
                    className="h-20 rounded-2xl flex flex-col items-center justify-center gap-2"
                    onClick={() => router.push('/dashboard/bookings')}
                >
                    <Calendar className="h-6 w-6" />
                    <span className="font-bold">Lịch đặt sân</span>
                </Button>
                <Button
                    variant="outline"
                    className="h-20 rounded-2xl flex flex-col items-center justify-center gap-2"
                    onClick={() => router.push('/matches')}
                >
                    <Shield className="h-6 w-6" />
                    <span className="font-bold">Kèo đấu</span>
                </Button>
                <Button
                    variant="outline"
                    className="h-20 rounded-2xl flex flex-col items-center justify-center gap-2"
                    onClick={() => router.push('/dashboard/venues')}
                >
                    <Edit2 className="h-6 w-6" />
                    <span className="font-bold">Quản lý sân</span>
                </Button>
            </div>
        </div>
    );
}
