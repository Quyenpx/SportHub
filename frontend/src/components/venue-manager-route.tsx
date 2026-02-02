'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VenueManagerRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            router.push('/login');
            return;
        }

        try {
            const user = JSON.parse(userStr);

            // Check role
            if (user.role !== 'VENUE_MANAGER' && user.role !== 'ADMIN') {
                router.push('/');
                return;
            }

            // Check status
            if (user.status !== 'ACTIVE') {
                router.push('/');
                return;
            }

            setIsAuthorized(true);
        } catch (error) {
            router.push('/login');
        } finally {
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}
