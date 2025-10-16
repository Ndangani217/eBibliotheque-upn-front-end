'use client'

import { ReactQueryProvider } from '@/providers/reactQueryProvider'
import { ThemeProvider } from '@/providers/themeProvider'
import { Toaster } from 'sonner'
import type { ReactNode } from 'react'

interface ProvidersProps {
    children: ReactNode
}

/**
 * Wrapper global pour tous les contextes
 * - React Query
 * - Thème (dark/light)
 * - Notifications (Sonner)
 */
export function Providers({ children }: ProvidersProps) {
    return (
        <ReactQueryProvider>
            <ThemeProvider>
                {children}
                <Toaster position="top-right" richColors />
            </ThemeProvider>
        </ReactQueryProvider>
    )
}
