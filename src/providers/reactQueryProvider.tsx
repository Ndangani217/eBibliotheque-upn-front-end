'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'
import React from 'react'

/**
 * Configuration globale du client React Query
 * - 1 seul retry pour éviter les boucles
 * - gcTime = 5 min (les requêtes sont gardées en cache)
 * - handleError global (via meta) : affiche un toast automatique en cas d'erreur
 */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            meta: {
                handleError: (error: any) => {
                    const message =
                        error?.response?.data?.message ??
                        error?.message ??
                        'Erreur réseau ou interne'
                    toast.error(message)
                },
            },
        },
        mutations: {
            retry: 0,
            meta: {
                handleError: (error: any) => {
                    const message =
                        error?.response?.data?.message ??
                        error?.message ??
                        'Erreur lors de la requête'
                    toast.error(message)
                },
            },
        },
    },
})

/**
 * Provider React Query global
 * À importer dans `app/layout.tsx`
 */
export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
