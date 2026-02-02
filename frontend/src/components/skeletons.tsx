import { Skeleton } from "@/components/ui/skeleton";

export function VenueCardSkeleton() {
    return (
        <div className="group glass-card rounded-3xl overflow-hidden">
            {/* Image skeleton */}
            <Skeleton className="h-64 w-full rounded-none" />

            <div className="p-8 space-y-4">
                {/* Title skeleton */}
                <Skeleton className="h-8 w-3/4" />

                {/* Address skeleton */}
                <div className="flex items-start gap-2">
                    <Skeleton className="h-4 w-4 shrink-0 mt-1" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>

                {/* Button skeleton */}
                <Skeleton className="h-12 w-full rounded-xl" />
            </div>
        </div>
    );
}

export function CourtCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-28" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-32" />
                </div>
            </div>
        </div>
    );
}

export function BookingCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
            </div>

            <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-36" />
                </div>
            </div>
        </div>
    );
}

export function MatchCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-36" />
                </div>
            </div>

            <Skeleton className="h-10 w-full rounded-lg" />
        </div>
    );
}
