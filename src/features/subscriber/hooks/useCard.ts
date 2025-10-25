'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
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
    return useQuery<SubscriptionCard | null, AxiosError<ApiError>>({
        queryKey: ['subscription-card'],
        queryFn: async () => {
            try {
                const { data } = await api.get('/payments/cards/active')
                return data ?? null
            } catch (error) {
                const err = error as AxiosError<ApiError>
                if (err.response?.status === 404) return null
                throw error
            }
        },
    })
}
