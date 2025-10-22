'use client'

import { useAuthStore } from '@/features/auth'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/services/api'
import { useRouter } from 'next/navigation'
import type { AxiosError } from 'axios'

interface SubscriptionType {
    id: number
    category: string
    duration: number
    price: number
    devise: string
}

interface ApiError {
    status: string
    message: string
}

interface GenerateVoucherPayload {
    category: string
    duration: number
    bank?: string
}

/**
 * Liste les formules disponibles selon la catégorie de l’utilisateur
 */
export function useSubscriptions() {
    const { user } = useAuthStore()

    return useQuery<SubscriptionType[], AxiosError<ApiError>>({
        queryKey: ['subscription-types', user?.category],
        queryFn: async () => {
            const { data } = await api.get(`/payments/subscription-types/${user?.category}`)
            return data
        },
        enabled: !!user?.category,
        meta: {
            handleError: (error: AxiosError<ApiError>) => {
                const message =
                    error.response?.data?.message ??
                    'Erreur lors du chargement des formules d’abonnement.'
                toast.error(message)
            },
        },
    })
}

/**
 * Génère un bon de paiement PDF (et ouvre le PDF automatiquement)
 */
export function useGenerateVoucher() {
    const router = useRouter()

    return useMutation({
        mutationFn: async (payload: GenerateVoucherPayload) => {
            const { data } = await api.post('/payments/vouchers', payload, {
                responseType: 'blob',
            })
            // Téléchargement automatique du PDF
            const blob = new Blob([data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            window.open(url)
        },
        meta: {
            handleError: (error: AxiosError<ApiError>) => {
                const message =
                    error.response?.data?.message ??
                    'Erreur lors de la génération du bon de paiement.'
                toast.error(message)
            },
        },
        //gestion manuelle du succès (supportée en v5)
        onSuccess: () => {
            toast.success('Bon de paiement généré avec succès.')
            router.push('/subscriber/payments')
        },
    })
}
