import React from 'react';
import { Activity, Zap, CircleDot, Dumbbell } from 'lucide-react';

interface SportIconProps {
    type: string;
    className?: string;
}

// Mapping icon và màu sắc cho từng loại sân
const sportConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
    PICKLEBALL: {
        icon: Activity,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    BADMINTON: {
        icon: Zap,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    SOCCER: {
        icon: CircleDot,
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    TENNIS: {
        icon: Dumbbell,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
};

export function SportIcon({ type, className = '' }: SportIconProps) {
    const config = sportConfig[type] || sportConfig.PICKLEBALL;
    const Icon = config.icon;

    return (
        <div className={`flex items-center justify-center ${config.bgColor} ${className}`}>
            <Icon className={`${config.color}`} />
        </div>
    );
}

// Export mapping để sử dụng ở nơi khác nếu cần
export const getSportConfig = (type: string) => {
    return sportConfig[type] || sportConfig.PICKLEBALL;
};

// Export tên tiếng Việt
export const getSportName = (type: string): string => {
    const names: Record<string, string> = {
        PICKLEBALL: 'Pickleball',
        BADMINTON: 'Cầu lông',
        SOCCER: 'Bóng đá',
        TENNIS: 'Tennis',
    };
    return names[type] || type;
};
