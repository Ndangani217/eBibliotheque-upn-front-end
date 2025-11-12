/**
 * Service API pour l'authentification
 */
import api from '../apiClient'
import type { ApiSuccessResponse } from '@/types/api'
import type { User } from '@/types/user'

export interface LoginPayload {
    email: string
    password: string
}

export interface LoginResponse {
    accessToken: { token: string }
    refreshToken: string
    user: User
}

export interface RefreshTokenPayload {
    refreshToken: string
}

export interface RefreshTokenResponse {
    accessToken: { token: string }
    refreshToken: string
}

export interface RequestPasswordResetPayload {
    email: string
}

export interface ResetPasswordPayload {
    newPassword: string
}

export interface SetPasswordPayload {
    newPassword: string
}

export const authApi = {
    /**
     * Connexion
     */
    login: async (payload: LoginPayload) => {
        const { data } = await api.post<ApiSuccessResponse<LoginResponse>>('/auth/login', payload)
        return data.data
    },

    /**
     * Déconnexion
     */
    logout: async () => {
        await api.delete<ApiSuccessResponse>('/auth/logout')
    },

    /**
     * Récupère l'utilisateur authentifié
     */
    getMe: async () => {
        const { data } = await api.get<ApiSuccessResponse<{ user: User }>>('/auth/me')
        return data.data.user
    },

    /**
     * Rafraîchit le token d'accès
     */
    refreshToken: async (payload: RefreshTokenPayload) => {
        const { data } = await api.post<ApiSuccessResponse<RefreshTokenResponse>>(
            '/auth/refresh',
            payload,
        )
        return data.data
    },

    /**
     * Demande une réinitialisation de mot de passe
     */
    requestPasswordReset: async (payload: RequestPasswordResetPayload) => {
        const { data } = await api.post<ApiSuccessResponse>('/auth/forgot-password', payload)
        return data
    },

    /**
     * Réinitialise le mot de passe
     */
    resetPassword: async (token: string, payload: ResetPasswordPayload) => {
        const { data } = await api.post<ApiSuccessResponse>(
            `/auth/reset-password/${token}`,
            payload,
        )
        return data
    },

    /**
     * Définit le mot de passe initial
     */
    setPassword: async (token: string, payload: SetPasswordPayload) => {
        const { data } = await api.post<ApiSuccessResponse>(`/auth/set-password/${token}`, payload)
        return data
    },
}

