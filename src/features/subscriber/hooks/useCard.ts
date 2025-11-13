'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { useAuthState } from '@/lib/hooks'
import type { AxiosError } from 'axios'

export interface SubscriptionCard {
    id: string
    qr_code_path: string
    pdf_path: string
    issued_at: string
    is_active: boolean
    unique_code?: string
    qr_code_url?: string
    subscription?: {
        start_date: string
        end_date: string
        category: string
        expired?: boolean
    }
}

interface ApiError {
    status: string
    message: string
}

/**
 *Récupère la carte active de l’abonné connecté
 */
export function useCard() {
    const { canFetch } = useAuthState()
    
    return useQuery<SubscriptionCard | null, AxiosError<ApiError>>({
        queryKey: ['subscription-card'],
        queryFn: async () => {
            try {
                const { data } = await api.get('/payments/cards/active')
                return data ?? null
            } catch (error) {
                const err = error as AxiosError<ApiError>
                // 404 est normal si l'utilisateur n'a pas encore de carte
                if (err.response?.status === 404) return null
                // Pour les erreurs 401, ne pas throw pour éviter la déconnexion automatique
                // L'intercepteur gère déjà la déconnexion si nécessaire
                if (err.response?.status === 401) {
                    console.warn('⚠️ Erreur 401 lors de la récupération de la carte, retour null')
                    return null
                }
                throw error
            }
        },
        // Ne pas exécuter la requête tant que l'utilisateur n'est pas authentifié et que le token n'est pas disponible
        enabled: canFetch,
        // Ne pas refetch automatiquement en cas d'erreur
        retry: false,
        // Ne pas refetch au focus de la fenêtre
        refetchOnWindowFocus: false,
    })
}
