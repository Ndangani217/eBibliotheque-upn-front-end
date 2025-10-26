'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { toast } from 'sonner'

export interface Card {
    id: string
    subscriberName: string
    subscriptionType: string
    status: 'active' | 'inactive'
    qrCodeUrl: string
    expiresAt: string
}

export function useManagerCards() {
    return useQuery({
        queryKey: ['manager-cards'],
        queryFn: async () => {
            const { data } = await api.get('/manager/cards')
            return data.data || []
        },
    })
}

export function useActivateCard() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.patch(`/manager/cards/${id}/activate`)
            return data
        },
        onSuccess: () => {
            toast.success('Carte activée avec succès')
            queryClient.invalidateQueries({ queryKey: ['manager-cards'] })
            queryClient.invalidateQueries({ queryKey: ['manager-dashboard'] })
        },
        onError: () => toast.error('Erreur lors de l’activation de la carte'),
    })
}

export function usePrintCard() {
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.get(`/manager/cards/${id}/print`, {
                responseType: 'blob',
            })
            const blob = new Blob([data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `carte-${id}.pdf`)
            document.body.appendChild(link)
            link.click()
        },
    })
}
