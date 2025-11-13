/**
 * Hooks pour la gestion des abonnés côté Manager
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import api from '@/services/api'
import { usersApi } from '@/services/api/users.api'
import type { ApiErrorResponse } from '@/types/api'
import type { User } from '@/types/user'
import type { PaginationMeta } from '@/types/api'

interface SubscribersResponse {
    data: User[]
    meta: PaginationMeta
}

interface SubscribersParams {
    page?: number
    limit?: number
    search?: string
}

/**
 * Liste des abonnés avec pagination et recherche
 */
export function useSubscribers(params: SubscribersParams = {}) {
    const { page = 1, limit = 10, search = '' } = params

    return useQuery<SubscribersResponse, AxiosError<ApiErrorResponse>>({
        queryKey: ['manager-subscribers', page, limit, search],
        queryFn: async () => {
            const { data } = await api.get<{ data: SubscribersResponse }>('/manager/users', {
                params: { page, limit, search },
            })
            return data.data
        },
    })
}

/**
 * Bloque un abonné
 */
export function useBlockSubscriber() {
    const queryClient = useQueryClient()

    return useMutation<void, AxiosError<ApiErrorResponse>, string>({
        mutationFn: async (id: string) => {
            await usersApi.block(id)
        },
        onSuccess: () => {
            toast.success('Abonné bloqué avec succès')
            queryClient.invalidateQueries({ queryKey: ['manager-subscribers'] })
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Erreur lors du blocage de l\'abonné')
        },
    })
}

/**
 * Débloque un abonné
 */
export function useUnblockSubscriber() {
    const queryClient = useQueryClient()

    return useMutation<void, AxiosError<ApiErrorResponse>, string>({
        mutationFn: async (id: string) => {
            await usersApi.unblock(id)
        },
        onSuccess: () => {
            toast.success('Abonné débloqué avec succès')
            queryClient.invalidateQueries({ queryKey: ['manager-subscribers'] })
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Erreur lors du déblocage de l\'abonné')
        },
    })
}

/**
 * Met à jour l'email d'un abonné
 */
export function useUpdateSubscriberEmail() {
    const queryClient = useQueryClient()

    return useMutation<User, AxiosError<ApiErrorResponse>, { id: string; email: string }>({
        mutationFn: async ({ id, email }) => {
            return await usersApi.update(id, { email })
        },
        onSuccess: () => {
            toast.success('Email mis à jour avec succès')
            queryClient.invalidateQueries({ queryKey: ['manager-subscribers'] })
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'email')
        },
    })
}

/**
 * Envoie un lien de réinitialisation de mot de passe à un abonné
 */
export function useSendPasswordResetLink() {
    return useMutation<void, AxiosError<ApiErrorResponse>, string>({
        mutationFn: async (id: string) => {
            await api.post(`/manager/users/${id}/send-password-reset`)
        },
        onSuccess: () => {
            toast.success('Lien de réinitialisation envoyé avec succès')
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                    'Erreur lors de l\'envoi du lien de réinitialisation',
            )
        },
    })
}

