'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'
import type { User } from '@/types/user'

/** Structure d’erreur API */
interface ApiError {
    status: string
    message: string
    errors?: Record<string, string[]>
}

/** Données pour créer ou mettre à jour un utilisateur */
interface UserPayload {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    category?: User['category']
    role: User['role']
}

/** Structure de pagination */
interface PaginatedResponse<T> {
    data: T[]
    meta: {
        total: number
        per_page: number
        current_page: number
        last_page: number
    }
}

/** ========================== LISTES ========================== **/

// Liste des utilisateurs vérifiés
export function useVerifiedUsers(search?: string, page = 1, limit = 10) {
    return useQuery<PaginatedResponse<User>, AxiosError<ApiError>>({
        queryKey: ['users', 'verified', search, page],
        queryFn: async () => {
            const { data } = await api.get('/users', {
                params: { search, page, limit },
            })
            return data.data
        },
    })
}

// Liste des utilisateurs non vérifiés
export function useUnverifiedUsers(search?: string, page = 1, limit = 10) {
    return useQuery<PaginatedResponse<User>, AxiosError<ApiError>>({
        queryKey: ['users', 'unverified', search, page],
        queryFn: async () => {
            const { data } = await api.get('/users/unverified', {
                params: { search, page, limit },
            })
            return data.data
        },
    })
}

/** ========================== DÉTAILS ========================== **/

// Détails d’un utilisateur
export function useUser(id: string) {
    return useQuery<User, AxiosError<ApiError>>({
        queryKey: ['user', id],
        queryFn: async () => {
            const { data } = await api.get<{ data: User }>(`/users/${id}`)
            return data.data
        },
        enabled: Boolean(id),
    })
}

/** ========================== CRÉATION / MISE À JOUR ========================== **/

// Créer un utilisateur
export function useCreateUser() {
    const queryClient = useQueryClient()
    return useMutation<User, AxiosError<ApiError>, UserPayload>({
        mutationFn: async (payload) => {
            const { data } = await api.post<{ data: User }>('/users', payload)
            return data.data
        },
        onSuccess: () => {
            toast.success('Utilisateur créé avec succès')
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (error) =>
            toast.error(error.response?.data?.message ?? 'Erreur lors de la création'),
    })
}

// Mettre à jour un utilisateur
export function useUpdateUser(id: string) {
    const queryClient = useQueryClient()
    return useMutation<User, AxiosError<ApiError>, Partial<UserPayload>>({
        mutationFn: async (payload) => {
            const { data } = await api.put<{ data: User }>(`/users/${id}`, payload)
            return data.data
        },
        onSuccess: () => {
            toast.success('Utilisateur mis à jour')
            queryClient.invalidateQueries({ queryKey: ['user', id] })
        },
        onError: (error) => toast.error(error.response?.data?.message ?? 'Erreur de mise à jour'),
    })
}

/** ========================== BLOQUER / DÉBLOQUER ========================== **/

// Bloquer un utilisateur
export function useBlockUser() {
    const queryClient = useQueryClient()
    return useMutation<void, AxiosError<ApiError>, string>({
        mutationFn: async (id) => {
            await api.patch(`/users/${id}/block`)
        },
        onSuccess: () => {
            toast.success('Utilisateur bloqué')
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (error) => toast.error(error.response?.data?.message ?? 'Erreur lors du blocage'),
    })
}

// Débloquer un utilisateur
export function useUnblockUser() {
    const queryClient = useQueryClient()
    return useMutation<void, AxiosError<ApiError>, string>({
        mutationFn: async (id) => {
            await api.patch(`/users/${id}/unblock`)
        },
        onSuccess: () => {
            toast.success('Utilisateur débloqué')
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (error) =>
            toast.error(error.response?.data?.message ?? 'Erreur lors du déblocage'),
    })
}

/** ========================== SUPPRESSION ========================== **/

// Supprimer un utilisateur
export function useDeleteUser() {
    const queryClient = useQueryClient()
    return useMutation<void, AxiosError<ApiError>, string>({
        mutationFn: async (id) => {
            await api.delete(`/users/${id}`)
        },
        onSuccess: () => {
            toast.success('Utilisateur supprimé')
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (error) =>
            toast.error(error.response?.data?.message ?? 'Erreur lors de la suppression'),
    })
}

/** ========================== SESSIONS ========================== **/

// Historique des sessions d’un utilisateur
export function useUserSessions(id: string) {
    return useQuery<
        { id: string; ip_address: string; logged_in_at: string; logged_out_at: string | null }[],
        AxiosError<ApiError>
    >({
        queryKey: ['user-sessions', id],
        queryFn: async () => {
            const { data } = await api.get(`/users/${id}/sessions`)
            return data.data
        },
        enabled: Boolean(id),
    })
}

/** ========================== STATISTIQUES ========================== **/

interface UserStats {
    total: number
    actifs: number
    bloques: number
    nonVerifies: number
}

// Statistiques des utilisateurs
export function useUserStats() {
    return useQuery<UserStats, AxiosError<ApiError>>({
        queryKey: ['user-stats'],
        queryFn: async () => {
            const { data } = await api.get<{ data: UserStats }>('/users/stats')
            return data.data
        },
    })
}

/** ========================== PROMOTION (rôle) ========================== **/

export function usePromoteUser() {
    const queryClient = useQueryClient()
    return useMutation<User, AxiosError<ApiError>, { id: string; role: string }>({
        mutationFn: async ({ id, role }) => {
            const { data } = await api.patch<{ data: User }>(`/users/${id}/promote`, { role })
            return data.data
        },
        onSuccess: () => {
            toast.success('Rôle utilisateur modifié')
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (error) =>
            toast.error(error.response?.data?.message ?? 'Erreur lors du changement de rôle'),
    })
}
