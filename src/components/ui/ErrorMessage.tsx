/**
 * ErrorMessage - Messages d'erreur guidés et rassurants
 * Design cohérent avec messages positifs pour réduire l'anxiété
 */

import { AlertCircle, X } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
    title: string
    description?: string
    onRetry?: () => void
    onDismiss?: () => void
    className?: string
    variant?: 'default' | 'inline' | 'banner'
}

export function ErrorMessage({
    title,
    description,
    onRetry,
    onDismiss,
    className,
    variant = 'default',
}: ErrorMessageProps) {
    const content = (
        <div className="flex items-start gap-3 sm:gap-4">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-error flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-semibold text-text mb-1">{title}</h4>
                {description && (
                    <p className="text-sm text-text-secondary">{description}</p>
                )}
                {onRetry && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRetry}
                        className="mt-3"
                    >
                        Réessayer
                    </Button>
                )}
            </div>
            {onDismiss && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDismiss}
                    className="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8"
                >
                    <X className="w-4 h-4" />
                </Button>
            )}
        </div>
    )

    const variants = {
        default: 'rounded-[9px] border border-error/20 bg-error-light/50 p-4 sm:p-6',
        inline: 'text-error',
        banner: 'rounded-[9px] border-l-4 border-error bg-error-light/30 p-4',
    }

    return (
        <div className={cn(variants[variant], className)} role="alert">
            {content}
        </div>
    )
}

