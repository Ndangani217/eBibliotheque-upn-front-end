'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/services/api'

/**Hook corrigé et typé */
export function useManagers(search?: string, page = 1, limit = 10) {
    return useQuery({
		queryKey: ['managers', search, page, limit],
        queryFn: async () => {
			const result = await usersApi.list({ search, page, limit })
			return result
        },
    })
}

/**Bloquer un manager */
export function useBlockManager() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            await usersApi.block(id)
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
            await usersApi.unblock(id)
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
            await usersApi.delete(id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['managers'] })
        },
    })
}

