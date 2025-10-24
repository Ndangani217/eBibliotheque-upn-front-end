'use client'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/services/api'
import type { AxiosError } from 'axios'

export interface PaymentVoucher {
    id: number
    reference_code: string
    amount: number
    duration?: number
    status: string
    created_at: string
}

interface ApiError {
    status: string
    message: string
}

export function usePayments() {
    return useQuery<PaymentVoucher[], AxiosError<ApiError>>({
        queryKey: ['vouchers'],
        queryFn: async () => {
            const { data } = await api.get('/payments/vouchers')

            const vouchers = data?.data?.data
            if (!Array.isArray(vouchers)) {
                console.warn('Structure inattendue de la réponse:', data)
                toast.error('Format inattendu des données reçues du serveur.')
                return []
            }
            return vouchers
        },
    })
}
