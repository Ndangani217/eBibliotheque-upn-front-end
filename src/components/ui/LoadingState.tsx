/**
 * LoadingState - États de chargement cohérents et rassurants
 * Optimisé pour mobile avec animations fluides
 */

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
    message?: string
    size?: 'sm' | 'md' | 'lg'
    className?: string
    fullScreen?: boolean
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
}

export function LoadingState({
    message = 'Chargement en cours...',
    size = 'md',
    className,
    fullScreen = false,
}: LoadingStateProps) {
    const content = (
        <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
            <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
            {message && (
                <p className="text-sm sm:text-base text-text-secondary text-center">{message}</p>
            )}
        </div>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
                {content}
            </div>
        )
    }

    return content
}

