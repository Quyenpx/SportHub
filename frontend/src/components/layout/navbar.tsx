'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, LogOut, User, Shield, Zap, Calendar, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationBell } from '@/components/notification-bell';
import { cn } from '@/lib/utils';

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (error) {
                console.error('Failed to parse user data');
            }
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const isAdmin = user?.role === 'ADMIN';
    const canManageVenues = user?.role === 'VENUE_MANAGER' || isAdmin;
    const isLoggedIn = !!user;

    const navItems = [
        { href: '/venues', label: 'Sân thể thao', icon: <Zap className="h-4 w-4" /> },
        { href: '/matches', label: 'Tìm đối', icon: <User className="h-4 w-4" /> },
    ];

    if (isLoggedIn) {
        if (canManageVenues) {
            navItems.push({ href: '/dashboard/manage-bookings', label: 'Duyệt đơn', icon: <CalendarCheck className="h-4 w-4" /> });
            navItems.push({ href: '/dashboard/venues', label: 'Quản lý sân', icon: <Shield className="h-4 w-4" /> });
        }
        // Menu item dành cho tất cả user đã đăng nhập (bao gồm cả manager muốn đi đặt sân khác)
        navItems.push({ href: '/dashboard/bookings', label: 'Lịch đặt', icon: <Calendar className="h-4 w-4" /> });
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
            <nav
                className={cn(
                    "pointer-events-auto w-full max-w-5xl rounded-full border transition-all duration-300 ease-in-out relative",
                    scrolled
                        ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-xl border-white/20 dark:border-white/10"
                        : "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-white/30 shadow-md"
                )}
            >
                {/* Background & Effects Container - Clipped to rounded shape */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none -z-10">
                    {/* Gradient Border Effect - Stronger */}
                    <div className={cn(
                        "absolute inset-0 rounded-full p-[1px] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-orange-500/30 opacity-100",
                    )} />

                    {/* Background Gradient - Stronger */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-purple-100/30 to-orange-100/30 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-orange-900/20 opacity-100" />
                </div>

                <div className="flex px-2 items-center justify-between h-14 md:h-16 relative z-10">
                    {/* Logo Section */}
                    <div className="pl-4 flex-shrink-0 flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-gradient-to-br from-primary to-purple-600 p-1.5 rounded-xl shadow-lg group-hover:shadow-primary/50 transition-all duration-300 transform group-hover:scale-110">
                                <Zap className="h-5 w-5 text-white fill-current" />
                            </div>
                            <span className="text-xl font-black bg-gradient-to-r from-gray-900 via-primary to-purple-600 dark:from-white dark:via-primary dark:to-purple-400 bg-clip-text text-transparent">
                                SportHub
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Pill Tabs */}
                    <div className="hidden md:flex items-center gap-1.5 bg-white/50 dark:bg-gray-800/50 p-1.5 rounded-full border border-white/30 shadow-inner backdrop-blur-md">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ease-out relative flex items-center gap-2 group",
                                        isActive
                                            ? "text-white shadow-lg shadow-primary/30"
                                            : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-primary"
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full -z-10 animate-in zoom-in-95 duration-200" />
                                    )}
                                    <span className={cn("transition-colors", isActive ? "text-white" : "text-primary/70 group-hover:text-primary")}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Actions */}
                    <div className="pr-2 flex items-center gap-2">
                        {isLoggedIn ? (
                            <>
                                <div className="hidden md:flex items-center gap-2">
                                    <NotificationBell />

                                    <div className="h-4 w-[1px] bg-border mx-1 opacity-50"></div>

                                    {isAdmin && (
                                        <Link href="/admin">
                                            <Button variant="ghost" size="sm" className="rounded-full px-3 text-xs font-bold gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 border border-red-200/50">
                                                <Shield className="h-3.5 w-3.5" />
                                                ADMIN
                                            </Button>
                                        </Link>
                                    )}

                                    <Link href="/profile">
                                        <Button variant="ghost" size="icon" className="rounded-full overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs ring-2 ring-white dark:ring-gray-900 shadow-sm">
                                                {user?.fullName?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                        </Button>
                                    </Link>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                        onClick={handleLogout}
                                        title="Đăng xuất"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="rounded-full font-medium hover:text-primary hover:bg-primary/10 transition-colors">Đăng nhập</Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="rounded-full font-bold shadow-lg shadow-primary/20 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 transition-all transform hover:scale-105">
                                        Tham gia ngay
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <div className="md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-gray-100"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden px-4 pb-4 pt-2 space-y-2 border-t border-gray-100 dark:border-gray-800 bg-white/50 backdrop-blur-xl">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center w-full px-4 py-3 rounded-xl transition-all gap-3",
                                    pathname === item.href
                                        ? "bg-primary/10 text-primary font-bold shadow-sm"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-foreground"
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                        <div className="h-[1px] bg-border/50 my-2"></div>
                        {isLoggedIn ? (
                            <>
                                <Link href="/profile" className="flex items-center w-full px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-foreground gap-3" onClick={() => setMobileMenuOpen(false)}>
                                    <User className="h-5 w-5" />
                                    Trang cá nhân
                                </Link>
                                {isAdmin && (
                                    <Link href="/admin" className="flex items-center w-full px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600 gap-3" onClick={() => setMobileMenuOpen(false)}>
                                        <Shield className="h-5 w-5" />
                                        Quản trị viên
                                    </Link>
                                )}
                                <button
                                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                    className="flex items-center w-full px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 gap-3"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full rounded-xl">Đăng nhập</Button>
                                </Link>
                                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full rounded-xl bg-primary text-white">Đăng ký</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </div>
    );
}
