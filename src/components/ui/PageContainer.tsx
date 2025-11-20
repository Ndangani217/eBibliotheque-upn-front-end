/**
 * PageContainer - Conteneur de page responsive et cohérent
 * Optimisé pour mobile-first avec espacements adaptatifs
 */

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
    children: ReactNode
    className?: string
    title?: string
    description?: string
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
}

export function PageContainer({
    children,
    className,
    title,
    description,
    maxWidth = 'full',
}: PageContainerProps) {
    return (
        <div className={cn('w-full mx-auto px-4 sm:px-6 lg:px-8', maxWidthClasses[maxWidth], className)}>
            {(title || description) && (
                <header className="mb-6 sm:mb-8 space-y-2">
                    {title && (
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text">
                            {title}
                        </h1>
                    )}
                    {description && (
                        <p className="text-sm sm:text-base text-text-secondary">{description}</p>
                    )}
                </header>
            )}
            <main className="space-y-4 sm:space-y-6">{children}</main>
        </div>
    )
}

