import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    secondaryActionLabel,
    onSecondaryAction,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="relative mb-8">
                {/* Decorative circles */}
                <div className="absolute inset-0 -m-8">
                    <div className="absolute top-0 left-0 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
                </div>

                {/* Icon */}
                <div className="relative bg-muted/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-dashed border-muted-foreground/20">
                    <Icon className="h-20 w-20 text-muted-foreground/40" strokeWidth={1.5} />
                </div>
            </div>

            <div className="text-center space-y-3 max-w-md">
                <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>

            {(actionLabel || secondaryActionLabel) && (
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    {actionLabel && onAction && (
                        <Button onClick={onAction} size="lg" className="rounded-xl">
                            {actionLabel}
                        </Button>
                    )}
                    {secondaryActionLabel && onSecondaryAction && (
                        <Button onClick={onSecondaryAction} variant="outline" size="lg" className="rounded-xl">
                            {secondaryActionLabel}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
