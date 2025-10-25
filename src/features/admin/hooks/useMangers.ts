'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'

/* Type utilisateur */
interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    role: string
    isBlocked: boolean
}

/* Type de la pagination */
interface PaginatedResponse<T> {
    meta: {
        total: number
        perPage: number
        currentPage: number
        lastPage: number
    }
    data: T[]
}

/* Type de la réponse complète */
interface ApiResponse<T> {
    status: string
    message: string
    data: PaginatedResponse<T>
}

/**Hook corrigé et typé */
export function useManagers(search?: string) {
    return useQuery({
        queryKey: ['managers', search],
        queryFn: async () => {
            const { data } = await api.get('/users', {
                params: { search },
            })
            const users = data?.data?.data
            return Array.isArray(users) ? users : []
        },
    })
}

/**Bloquer un manager */
export function useBlockManager() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.patch(`/users/${id}/block`)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['managers'] })
        },
    })
}

/**Débloquer un manager */
export function useUnblockManager() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.patch(`/users/${id}/unblock`)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['managers'] })
        },
    })
}

/**Supprimer un manager */
export function useDeleteManager() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete(`/users/${id}`)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['managers'] })
        },
    })
}
