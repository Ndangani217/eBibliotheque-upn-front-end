'use client'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/services/api'
import type { AxiosError } from 'axios'

/**
 * Type représentant un bon de paiement
 * Doit correspondre à la structure renvoyée par AdonisJS
 */
export interface PaymentVoucher {
    id: number
    reference_code: string
    amount: number
    duration?: number
    status: string
    created_at: string
}

/**
 * Type d'erreur standard de l'API
 */
interface ApiError {
    status: string
    message: string
}

/**
 * Liste les bons de paiement de l’utilisateur connecté
 */
export function usePayments() {
    return useQuery<PaymentVoucher[], AxiosError<ApiError>>({
        queryKey: ['vouchers'],
        queryFn: async () => {
            const { data } = await api.get('/payments/vouchers')
            return data?.data || data
        },
        meta: {
            handleError: (error: AxiosError<ApiError>) => {
                const message =
                    error.response?.data?.message ?? 'Erreur lors du chargement des bons'
                toast.error(message)
            },
        },
    })
}
