/**
 * EmptyState - États vides informatifs et guidés
 * Design institutionnel avec messages positifs
 */

import { LucideIcon } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
    icon?: LucideIcon
    title: string
    description?: string
    action?: {
        label: string
        onClick: () => void
    }
    className?: string
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center',
                className,
            )}
        >
            {Icon && (
                <div className="mb-4 p-3 rounded-full bg-primary/10">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </div>
            )}
            <h3 className="text-lg sm:text-xl font-semibold text-text mb-2">{title}</h3>
            {description && (
                <p className="text-sm sm:text-base text-text-secondary max-w-md mb-6">
                    {description}
                </p>
            )}
            {action && (
                <Button onClick={action.onClick} className="mt-2">
                    {action.label}
                </Button>
            )}
        </div>
    )
}

