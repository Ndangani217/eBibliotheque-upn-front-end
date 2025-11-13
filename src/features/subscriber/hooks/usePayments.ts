'use client'

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/services/api'
import { useAuthState } from '@/lib/hooks'
import type { AxiosError } from 'axios'

export interface PaymentVoucher {
    id: number
    reference_code: string
    amount: number
    duration?: number
    status: string
    created_at: string
}

export interface ActiveVoucher {
    id: number
    referenceCode: string
    amount: number
    status: string
    createdAt: string
    expiresAt: string | null
    duration: number
    category: string
}

interface ApiError {
    status: string
    message: string
}

export function usePayments() {
    const { canFetch } = useAuthState()
    
    return useQuery<PaymentVoucher[], AxiosError<ApiError>>({
        queryKey: ['vouchers'],
        queryFn: async () => {
            try {
                const { data } = await api.get('/payments/vouchers')

                const vouchers = data?.data?.data
                if (!Array.isArray(vouchers)) {
                    console.warn('Structure inattendue de la réponse:', data)
                    toast.error('Format inattendu des données reçues du serveur.')
                    return []
                }
                return vouchers
            } catch (error) {
                const err = error as AxiosError<ApiError>
                // Pour les erreurs 401, retourner un tableau vide au lieu de throw
                // L'intercepteur gère déjà la déconnexion si nécessaire
                if (err.response?.status === 401) {
                    console.warn('⚠️ Erreur 401 lors de la récupération des paiements, retour tableau vide')
                    return []
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

/**
 * Récupère le bon actif (non expiré) de l'utilisateur authentifié
 */
export function useActiveVoucher() {
    const { canFetch } = useAuthState()
    
    return useQuery<ActiveVoucher | null, AxiosError<ApiError>>({
        queryKey: ['active-voucher'],
        queryFn: async () => {
            try {
                const { data } = await api.get<{ status: string; data: ActiveVoucher | null }>('/payments/vouchers/active')
                return data.data
            } catch (error) {
                const err = error as AxiosError<ApiError>
                if (err.response?.status === 401 || err.response?.status === 404) {
                    return null
                }
                throw error
            }
        },
        enabled: canFetch,
        retry: false,
        refetchOnWindowFocus: false,
    })
}

export function useValidatePayment() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: number) => {
            await api.post(`/payments/vouchers/${id}/validate`)
        },
        onSuccess: () => {
            toast.success('Paiement validé et carte générée !')
            queryClient.invalidateQueries({ queryKey: ['subscription-card'] })
        },
        onError: () => toast.error('Erreur lors de la validation du paiement.'),
    })
}
