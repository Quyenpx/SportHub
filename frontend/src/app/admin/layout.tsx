'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Building2, Trophy, FileCheck, LogOut } from 'lucide-react';
import AdminRoute from '@/components/admin-route';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/requests', icon: FileCheck, label: 'Duyệt yêu cầu' },
        { href: '/admin/users', icon: Users, label: 'Người dùng' },
        { href: '/admin/venues', icon: Building2, label: 'Sân thể thao' },
        { href: '/admin/matches', icon: Trophy, label: 'Kèo đấu' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <AdminRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                {/* Sidebar */}
                <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
                    <div className="p-6">
                        <h1 className="text-2xl font-black text-blue-600">SportHub Admin</h1>
                        <p className="text-sm text-muted-foreground mt-1">Quản trị hệ thống</p>
                    </div>

                    <nav className="px-3 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                            ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 font-semibold'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="absolute bottom-0 left-0 right-0 p-3">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            Đăng xuất
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="ml-64 p-8">
                    {children}
                </main>
            </div>
        </AdminRoute>
    );
}
