'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { toast } from 'sonner'
import { Subscription, SubscriptionStatus } from '@/types/subscription'

export interface PaginationMeta {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
}

export interface SubscriptionQueryResult {
    items: Subscription[]
    meta: PaginationMeta
}

/**
 *Liste des abonnements paginée
 */
export function useManagerSubscriptions(
    status: SubscriptionStatus = SubscriptionStatus.VALIDE,
    page = 1,
    search = '',
) {
    return useQuery<SubscriptionQueryResult>({
        queryKey: ['manager-subscriptions', status, page, search],
        queryFn: async () => {
            const { data } = await api.get(`/manager/subscriptions`, {
                params: { status, page, search },
            })

            //correspond exactement à ta réponse Postman
            return {
                items: data.data ?? [],
                meta: {
                    total: data.meta?.total ?? 0,
                    perPage: data.meta?.perPage ?? 10,
                    currentPage: data.meta?.currentPage ?? 1,
                    lastPage: data.meta?.lastPage ?? 1,
                },
            }
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
        placeholderData: (prev) => prev,
    })
}

/**
 * 🔸 Hooks spécifiques par statut
 */
export function useActiveSubscriptions(page = 1, search = '') {
    return useManagerSubscriptions(SubscriptionStatus.VALIDE, page, search)
}
export function useExpiredSubscriptions(page = 1, search = '') {
    return useManagerSubscriptions(SubscriptionStatus.EXPIRE, page, search)
}
export function useSuspendedSubscriptions(page = 1, search = '') {
    return useManagerSubscriptions(SubscriptionStatus.SUSPENDU, page, search)
}

/**
 * Suspendre un abonnement
 */
export function useSuspendSubscription() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.patch(`/manager/subscriptions/${id}/suspend`)
            return data
        },
        onSuccess: () => {
            toast.success('Abonnement suspendu avec succès')
            queryClient.invalidateQueries({ queryKey: ['manager-subscriptions'] })
        },
        onError: () => {
            toast.error("Erreur lors de la suspension de l'abonnement")
        },
    })
}

/**
 * Imprimer une carte à partir de l'ID de l'abonnement
 */
export function usePrintCardBySubscription() {
    return useMutation<void, { message?: string }, string>({
        mutationFn: async (subscriptionId: string): Promise<void> => {
            const response = await api.get<Blob>(`/manager/subscriptions/${subscriptionId}/print-card`, {
                responseType: 'blob',
            })
            const blob = new Blob([response.data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `carte-${subscriptionId}.pdf`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        },
        onSuccess: () => {
            toast.success('Téléchargement du PDF lancé')
        },
        onError: (error) => {
            toast.error(error.message || 'Erreur lors de l\'impression de la carte')
        },
    })
}
