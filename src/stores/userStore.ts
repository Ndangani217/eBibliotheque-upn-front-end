'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/services/api'
import type { AxiosError } from 'axios'
import type { User } from '@/types/user'

/** Typage de l’erreur backend */
interface ApiError {
    status: string
    message: string
    errors?: Record<string, string[]>
}

/** Données attendues pour la création d’un utilisateur */
interface CreateUserPayload {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    category?: User['category']
    role: User['role']
}

/** Réponse du backend */
interface CreateUserResponse {
    status: string
    message: string
    data: User
}

/**
 * Hook React Query pour créer un utilisateur
 * -> correspond à UserController.store (POST /users)
 */
export function useStoreUser() {
    const queryClient = useQueryClient()

    return useMutation<User, AxiosError<ApiError>, CreateUserPayload>({
        mutationFn: async (payload) => {
            const { data } = await api.post<CreateUserResponse>('/users', payload)
            return data.data
        },

        onSuccess: (data) => {
            toast.success(`Utilisateur "${data.firstName} ${data.lastName}" créé avec succès`)
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },

        onError: (error) => {
            const message =
                error.response?.data?.message ?? 'Erreur lors de la création de l’utilisateur'
            toast.error(message)
        },
    })
}
