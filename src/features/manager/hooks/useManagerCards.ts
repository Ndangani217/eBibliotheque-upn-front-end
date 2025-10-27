'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { toast } from 'sonner'
import { LibraryCard, CardStatus } from '@/types/card'

/* ==========================================================
 * Types
 * ========================================================== */
export interface CardQueryMeta {
    total: number
    page: number
    lastPage: number
}

export interface CardQueryResult {
    items: LibraryCard[]
    meta: CardQueryMeta
}

export interface ApiSuccessResponse<T = unknown> {
    status: 'success'
    message: string
    data: T
}

export interface ApiErrorResponse {
    status: 'error'
    message: string
}

/* ==========================================================
 * Liste des cartes — (GET /manager/cards)
 * ========================================================== */
export function useManagerCards(
    status: CardStatus = CardStatus.ACTIVE,
    page: number = 1,
    search: string = '',
) {
    return useQuery<CardQueryResult>({
        queryKey: ['manager-cards', status, page, search],
        queryFn: async (): Promise<CardQueryResult> => {
            const { data } = await api.get<ApiSuccessResponse<LibraryCard[]>>('/manager/cards', {
                params: { status, page, search },
            })

            if (Array.isArray(data?.data)) {
                return {
                    items: data.data,
                    meta: { total: data.data.length, page, lastPage: 1 },
                }
            }

            return {
                items: [],
                meta: { total: 0, page, lastPage: 1 },
            }
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
        placeholderData: (prev) => prev,
    })
}

/* ==========================================================
 * Suspendre une carte — (PATCH /manager/cards/:id/suspend)
 * ========================================================== */
export function useSuspendCard() {
    const queryClient = useQueryClient()

    return useMutation<ApiSuccessResponse, ApiErrorResponse, string>({
        mutationFn: async (id: string): Promise<ApiSuccessResponse> => {
            const { data } = await api.patch<ApiSuccessResponse>(`/manager/cards/${id}/suspend`)
            return data
        },
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: ['manager-cards'] })
        },
        onError: (error) => {
            toast.error(error.message || 'Erreur lors de la suspension de la carte')
        },
    })
}

/* ==========================================================
 * Activer une carte — (PATCH /manager/cards/:id/activate)
 * ========================================================== */
export function useActivateCard() {
    const queryClient = useQueryClient()

    return useMutation<ApiSuccessResponse, ApiErrorResponse, string>({
        mutationFn: async (id: string): Promise<ApiSuccessResponse> => {
            const { data } = await api.patch<ApiSuccessResponse>(`/manager/cards/${id}/activate`)
            return data
        },
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: ['manager-cards'] })
        },
        onError: (error) => {
            toast.error(error.message || 'Erreur lors de l’activation de la carte')
        },
    })
}

/* ==========================================================
 * Imprimer une carte (PDF) — (GET /manager/cards/:id/print)
 * ========================================================== */
export function usePrintCard() {
    return useMutation<void, ApiErrorResponse, string>({
        mutationFn: async (id: string): Promise<void> => {
            const response = await api.get<Blob>(`/manager/cards/${id}/print`, {
                responseType: 'blob',
            })
            const blob = new Blob([response.data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `carte-${id}.pdf`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        },
        onSuccess: () => {
            toast.success('Téléchargement du PDF lancé')
        },
        onError: (error) => {
            toast.error(error.message || 'Erreur lors de l’impression de la carte')
        },
    })
}

/* ==========================================================
 * Valider un paiement — (PATCH /manager/payments/:id/validate)
 * ========================================================== */
export function useValidatePayment() {
    const queryClient = useQueryClient()

    return useMutation<ApiSuccessResponse, ApiErrorResponse, string>({
        mutationFn: async (id: string): Promise<ApiSuccessResponse> => {
            const { data } = await api.patch<ApiSuccessResponse>(`/manager/payments/${id}/validate`)
            return data
        },
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: ['manager-payments'] })
            queryClient.invalidateQueries({ queryKey: ['manager-cards'] })
            queryClient.invalidateQueries({ queryKey: ['manager-subscriptions'] })
        },
        onError: (error) => {
            toast.error(error.message || 'Erreur lors de la validation du paiement')
        },
    })
}
