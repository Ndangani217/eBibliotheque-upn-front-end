'use client'

import { useAuthStore } from '@/features/auth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/services/api'
import type { AxiosError, AxiosResponse } from 'axios'

export interface GenerateVoucherPayload {
    duration: number
    bank?: string
}

export interface ApiError {
    status: string
    message: string
}

export function useGenerateVoucher() {
    const token = useAuthStore((state) => state.token)
    const isLoadingUser = useAuthStore((state) => state.loading)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    return useMutation<boolean, AxiosError<ApiError>, GenerateVoucherPayload>({
        mutationFn: async (payload) => {
            if (isLoadingUser) throw new Error('Chargement du compte en cours...')
            if (!isAuthenticated || !token) throw new Error('Utilisateur non authentifié.')

            const response: AxiosResponse<Blob> = await api.post(
                '/payments/vouchers/generate',
                payload,
                {
                    responseType: 'blob',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/pdf',
                    },
                },
            )

            if (response.status !== 200) throw new Error('Erreur côté serveur.')

            const blob = new Blob([response.data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `bon_de_paiement_${payload.duration}mois.pdf`
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)

            toast.success('Bon de paiement généré avec succès !')
            return true
        },

        onError: (error) => {
            const message = error.response?.data?.message || error.message
            toast.error(`Erreur génération PDF: ${message}`)
            console.error('useGenerateVoucher error:', error)
        },
    })
}
