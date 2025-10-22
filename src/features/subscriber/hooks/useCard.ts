'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import type { AxiosError } from 'axios'

interface SubscriptionCard {
    id: string
    qr_code_path: string
    pdf_path: string
    issued_at: string
    is_active: boolean
    unique_code?: string
    subscription?: {
        start_date: string
        end_date: string
    }
}

interface ApiError {
    status: string
    message: string
}

/**
 * Récupère la carte active de l’abonné connecté
 */
export function useCard() {
    return useQuery<SubscriptionCard, AxiosError<ApiError>>({
        queryKey: ['subscription-card'],
        queryFn: async () => {
            const { data } = await api.get('/payments/cards/active')
            return data
        },
        meta: {
            handleError: (error: AxiosError<ApiError>) => {
                // Déclenche le toast automatiquement via le provider global
                const message =
                    error.response?.data?.message ?? 'Erreur lors du chargement de la carte.'
                throw new Error(message)
            },
        },
    })
}

/**
 * Télécharge la carte PDF depuis le backend
 */
export async function downloadCard(cardId: string) {
    const { data } = await api.get(`/payments/cards/download/${cardId}`, {
        responseType: 'blob',
    })
    const blob = new Blob([data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    window.open(url)
}
