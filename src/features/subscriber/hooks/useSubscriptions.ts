'use client'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/services/api'
import { downloadBlob } from '@/lib/fileDownload'
import { handleApiError } from '@/lib/errorHandler'
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
    return useMutation<boolean, AxiosError<ApiError>, GenerateVoucherPayload>({
        mutationFn: async (payload) => {
            // L'intercepteur d'axios gère automatiquement l'ajout du token depuis le store
            // Si le token n'est pas valide, l'API retournera une erreur 401
            // et l'intercepteur déconnectera automatiquement l'utilisateur
            const response: AxiosResponse<Blob> = await api.post(
                '/payments/vouchers/generate',
                payload,
                {
                    responseType: 'blob',
                    headers: {
                        Accept: 'application/pdf',
                    },
                },
            )

            if (response.status !== 200) throw new Error('Erreur côté serveur.')

            const blob = new Blob([response.data], { type: 'application/pdf' })
            downloadBlob(blob, `bon_de_paiement_${payload.duration}mois.pdf`)

            toast.success('Bon de paiement généré avec succès !')
            return true
        },

        onError: (error) => {
            handleApiError(
                error,
                'Erreur génération PDF',
                {
                    onSubscriptionError: (message) => toast.error(message),
                    onVoucherError: (message) => toast.error(message),
                }
            )
            console.error('useGenerateVoucher error:', error)
        },
    })
}
