'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, User, Building2 } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type UserRole = 'PLAYER' | 'VENUE_MANAGER';

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userType, setUserType] = useState<UserRole>('PLAYER');
    const [businessInfo, setBusinessInfo] = useState({
        businessName: '',
        businessPhone: '',
        note: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!phoneNumber) {
            toast.error('Số điện thoại là bắt buộc');
            return;
        }

        setLoading(true);
        try {
            const payload: any = {
                email,
                password,
                fullName,
                phoneNumber,
                role: userType,
            };

            if (userType === 'VENUE_MANAGER') {
                payload.businessInfo = businessInfo;
            }

            const res = await apiClient.post('/auth/register', payload);

            toast.success(res.data.message || 'Đăng ký thành công!');

            setTimeout(() => {
                router.push('/login');
            }, 1500);
        } catch (error: any) {
            console.error('Registration failed', error);
            toast.error(error.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black mb-2">Đăng ký tài khoản</h1>
                        <p className="text-muted-foreground">Tham gia cộng đồng SportHub</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* User Type Selection */}
                        <div>
                            <Label className="mb-3 block font-semibold">Loại tài khoản *</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setUserType('PLAYER')}
                                    className={`p-4 rounded-xl border-2 transition-all ${userType === 'PLAYER'
                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                        }`}
                                >
                                    <User className={`h-8 w-8 mx-auto mb-2 ${userType === 'PLAYER' ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <div className="text-sm font-semibold">Người chơi</div>
                                    <div className="text-xs text-muted-foreground mt-1">Tham gia thể thao</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUserType('VENUE_MANAGER')}
                                    className={`p-4 rounded-xl border-2 transition-all ${userType === 'VENUE_MANAGER'
                                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/30'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                        }`}
                                >
                                    <Building2 className={`h-8 w-8 mx-auto mb-2 ${userType === 'VENUE_MANAGER' ? 'text-purple-600' : 'text-gray-400'}`} />
                                    <div className="text-sm font-semibold">Quản lý sân</div>
                                    <div className="text-xs text-muted-foreground mt-1">Kinh doanh sân</div>
                                </button>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div>
                            <Label htmlFor="fullName">Họ và tên *</Label>
                            <Input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                placeholder="Nguyễn Văn A"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="email@example.com"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="phoneNumber">Số điện thoại *</Label>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                                placeholder="0912345678"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Mật khẩu *</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="Ít nhất 6 ký tự"
                                className="mt-1"
                            />
                        </div>

                        {/* Business Info - Only for VENUE_MANAGER */}
                        {userType === 'VENUE_MANAGER' && (
                            <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Building2 className="h-5 w-5 text-purple-600" />
                                    <h3 className="font-semibold text-purple-900 dark:text-purple-100">Thông tin kinh doanh</h3>
                                </div>

                                <div>
                                    <Label htmlFor="businessName">Tên doanh nghiệp/cơ sở</Label>
                                    <Input
                                        id="businessName"
                                        type="text"
                                        value={businessInfo.businessName}
                                        onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
                                        placeholder="VD: Sân thể thao ABC"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="businessPhone">SĐT kinh doanh</Label>
                                    <Input
                                        id="businessPhone"
                                        type="tel"
                                        value={businessInfo.businessPhone}
                                        onChange={(e) => setBusinessInfo({ ...businessInfo, businessPhone: e.target.value })}
                                        placeholder="0987654321"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="note">Lý do đăng ký</Label>
                                    <textarea
                                        id="note"
                                        value={businessInfo.note}
                                        onChange={(e) => setBusinessInfo({ ...businessInfo, note: e.target.value })}
                                        placeholder="Mô tả ngắn về cơ sở kinh doanh của bạn..."
                                        className="w-full p-2 border rounded-lg mt-1 min-h-[80px] text-sm"
                                    />
                                </div>

                                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                                    <p className="text-xs text-purple-900 dark:text-purple-100">
                                        ℹ️ <strong>Lưu ý:</strong> Tài khoản quản lý sân cần được admin phê duyệt trước khi sử dụng.
                                        Bạn sẽ nhận email thông báo khi tài khoản được kích hoạt.
                                    </p>
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                'Đăng ký'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-muted-foreground">Đã có tài khoản? </span>
                        <Link href="/login" className="text-blue-600 hover:underline font-semibold">
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
