'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { toast } from 'sonner'

export interface PaginationMeta {
    total: number
    per_page: number
    current_page: number
    last_page: number
}

export interface Payment {
    id: string
    referenceCode: string
    subscriberName: string
    category?: string
    amount: string
    status: 'en_attente' | 'paye'
    createdAt: string
    validatedAt?: string
}

export interface PaymentQueryResult {
    items: Payment[]
    meta: PaginationMeta
}

/**
 * Liste des paiements selon le statut + recherche + pagination
 */
export function useManagerPayments(
    status: 'en_attente' | 'paye' = 'en_attente',
    search: string = '',
    page: number = 1,
) {
    return useQuery<PaymentQueryResult>({
        queryKey: ['manager-payments', status, search, page],
        queryFn: async () => {
            const { data } = await api.get(
                `/manager/payments?status=${status}&search=${encodeURIComponent(
                    search,
                )}&page=${page}`,
            )

            return {
                items: data.data,
                meta: data.meta,
            } as PaymentQueryResult
        },
        placeholderData: (prev) => prev,
    })
}

/**
 * Validation d’un paiement (mutation)
 */

export function useValidatePayment() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.patch(`/manager/payments/${id}/validate`)
            return data
        },
        onSuccess: () => {
            toast.success('Paiement validé avec succès')
            queryClient.invalidateQueries({ queryKey: ['manager-payments'] })
            queryClient.invalidateQueries({ queryKey: ['manager-dashboard'] })
            queryClient.invalidateQueries({ queryKey: ['manager-subscriptions'] })
            queryClient.invalidateQueries({ queryKey: ['manager-cards'] })
        },
        onError: () => toast.error('Erreur lors de la validation du paiement'),
    })
}
