/**
 * Service API pour la gestion des utilisateurs
 */
import api from '../apiClient'
import type { ApiSuccessResponse, PaginationMeta } from '@/types/api'
import type { User } from '@/types/user'

export interface CreateUserPayload {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    role: string
    category?: string
    matricule?: string
}

export interface UpdateUserPayload {
    firstName?: string
    lastName?: string
    email?: string
    phoneNumber?: string
    category?: string
    matricule?: string
}

export interface RegisterSubscriberPayload {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    category: string
}

export interface UserListResponse {
    data: User[]
    meta: PaginationMeta
}

export interface UserStats {
    total: number
    active: number
    blocked: number
    unverified: number
}

export const usersApi = {
    /**
     * Liste les utilisateurs
     */
    list: async (params?: { page?: number; limit?: number; search?: string }) => {
        const { data } = await api.get<ApiSuccessResponse<{ data: User[]; meta: PaginationMeta }>>('/users', {
            params,
        })
        return { items: data.data.data, meta: data.data.meta }
    },

    /**
     * Liste les utilisateurs non vérifiés
     */
    listUnverified: async (params?: { page?: number; limit?: number; search?: string }) => {
        const { data } = await api.get<ApiSuccessResponse<{ data: User[]; meta: PaginationMeta }>>(
            '/users/unverified',
            { params },
        )
        return { items: data.data.data, meta: data.data.meta }
    },

    /**
     * Récupère un utilisateur par ID
     */
    getById: async (id: string) => {
        const { data } = await api.get<ApiSuccessResponse<User>>(`/users/${id}`)
        return data.data
    },

    /**
     * Crée un utilisateur
     */
    create: async (payload: CreateUserPayload) => {
        const { data } = await api.post<ApiSuccessResponse>('/users', payload)
        return data
    },

    /**
     * Inscrit un abonné
     */
    registerSubscriber: async (payload: RegisterSubscriberPayload) => {
        const { data } = await api.post<ApiSuccessResponse>('/users/register-subscriber', payload)
        return data
    },

    /**
     * Met à jour un utilisateur
     */
    update: async (id: string, payload: UpdateUserPayload) => {
        const { data } = await api.put<ApiSuccessResponse<User>>(`/users/${id}`, payload)
        return data.data
    },

    /**
     * Bloque un utilisateur
     */
    block: async (id: string) => {
        const { data } = await api.patch<ApiSuccessResponse>(`/users/${id}/block`)
        return data
    },

    /**
     * Débloque un utilisateur
     */
    unblock: async (id: string) => {
        const { data } = await api.patch<ApiSuccessResponse>(`/users/${id}/unblock`)
        return data
    },

    /**
     * Supprime un utilisateur
     */
    delete: async (id: string) => {
        const { data } = await api.delete<ApiSuccessResponse>(`/users/${id}`)
        return data
    },

    /**
     * Récupère les statistiques des utilisateurs
     */
    getStats: async () => {
        const { data } = await api.get<ApiSuccessResponse<UserStats>>('/users/stats/global')
        return data.data
    },
}

