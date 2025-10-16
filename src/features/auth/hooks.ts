'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'
import api from '@/services/api'
import { useAuthStore } from '@/features/auth/store'
import type { User } from '@/types/user'

interface ApiError {
    message?: string
}

interface AuthResponse {
    token: string
    user: User
}

interface LoginPayload {
    email: string
    password: string
}

interface RegisterSubscriberPayload {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    category: 'étudiant' | 'chercheur'
}

interface ForgotPasswordPayload {
    email: string
}

export interface ResetPasswordPayload {
    token: string
    newPassword: string
    confirmPassword: string
}

export interface CreateAdminUserPayload {
    firstName: string
    lastName: string
    email: string
    role: 'admin' | 'gestionnaire' | 'gestionnaire_observateur'
}

export function useLogin() {
    const router = useRouter()
    const setAuth = useAuthStore((s) => s.setAuth)

    return useMutation<AuthResponse, AxiosError<ApiError>, LoginPayload>({
        mutationFn: async (payload) => {
            const { data } = await api.post<AuthResponse>('/auth/login', payload)
            return data
        },
        onSuccess: (data) => {
            setAuth(data.user, data.token)
            toast.success('Connexion réussie')
            router.push('/dashboard')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Erreur de connexion.')
        },
    })
}

export function useLogout() {
    const queryClient = useQueryClient()
    const clearAuth = useAuthStore((s) => s.logout)
    const router = useRouter()

    return useMutation<void, AxiosError<ApiError>, void>({
        mutationFn: async () => {
            await api.delete('/auth/logout')
        },
        onSuccess: () => {
            clearAuth()
            queryClient.clear()
            toast.success('Déconnexion réussie 👋')
            router.push('/login')
        },
        onError: () => toast.error('Erreur lors de la déconnexion.'),
    })
}

export function useAuthenticatedUser() {
    const token = useAuthStore((s) => s.token)
    const setUser = useAuthStore((s) => s.setUser)

    return useQuery<User, AxiosError<ApiError>>({
        queryKey: ['auth', 'me'],
        queryFn: async () => {
            const { data } = await api.get<{ user: User }>('/auth/me', {
                headers: { Authorization: `Bearer ${token}` },
            })
            setUser(data.user)
            return data.user
        },
        enabled: !!token,
    })
}

export function useRegisterSubscriber() {
    const router = useRouter()

    return useMutation<{ message: string }, AxiosError<ApiError>, RegisterSubscriberPayload>({
        mutationFn: async (payload) => {
            const { data } = await api.post<{ message: string }>(
                '/users/register-subscriber',
                payload,
            )
            return data
        },
        onSuccess: (res) => {
            toast.success(res.message || 'Inscription réussie. Vérifiez votre e-mail 📩')
            router.push('/login')
        },
        onError: (error) =>
            toast.error(error.response?.data?.message || 'Erreur lors de l’inscription.'),
    })
}

export function useForgotPassword() {
    return useMutation<{ message: string }, AxiosError<ApiError>, ForgotPasswordPayload>({
        mutationFn: async (payload) => {
            const { data } = await api.post<{ message: string }>('/auth/forgot-password', payload)
            return data
        },
        onSuccess: (res) => {
            toast.success(res.message || 'Lien envoyé pour réinitialiser le mot de passe 📧')
        },
        onError: (error) =>
            toast.error(
                error.response?.data?.message || 'Erreur lors de la demande de réinitialisation.',
            ),
    })
}

export function useResetPassword() {
    const router = useRouter()
    return useMutation<{ message: string }, AxiosError<ApiError>, ResetPasswordPayload>({
        mutationFn: async (payload) => {
            const { data } = await api.post<{ message: string }>(
                `/auth/reset-password/${payload.token}`,
                { newPassword: payload.newPassword },
            )
            return data
        },
        onSuccess: (res) => {
            toast.success(res.message || 'Mot de passe réinitialisé')
            router.push('/login')
        },
        onError: (error) =>
            toast.error(error.response?.data?.message || 'Erreur lors de la réinitialisation.'),
    })
}

export function useSetPassword() {
    return useMutation<{ message: string }, AxiosError<ApiError>, ResetPasswordPayload>({
        mutationFn: async (payload) => {
            const { data } = await api.post<{ message: string }>(
                `/auth/set-password/${payload.token}`,
                {
                    newPassword: payload.newPassword,
                    newPassword_confirmation: payload.confirmPassword,
                },
            )

            return data
        },
        onSuccess: (res) => {
            toast.success(res.message || 'Mot de passe réinitialisé')
        },
        onError: (error) =>
            toast.error(
                error.response?.data?.message ||
                    'Erreur lors de la réinitialisation du mot de passe',
            ),
    })
}

export function useAuth() {
    const { user, token, isAuthenticated, setAuth, logout: clearAuth } = useAuthStore()
    const login = useLogin()
    const register = useRegisterSubscriber()
    const logout = useLogout()

    return {
        user,
        token,
        isAuthenticated,
        setAuth,
        clearAuth,
        login: login.mutate,
        register: register.mutate,
        logout: logout.mutate,
        isLoggingIn: login.isPending,
        isRegistering: register.isPending,
    }
}

/**
 *  Hook pour la création d’un utilisateur par un administrateur
 */
export function useCreateUserByAdmin() {
    return useMutation<{ message: string }, AxiosError<ApiError>, CreateAdminUserPayload>({
        // Appel API
        mutationFn: async (payload) => {
            const { data } = await api.post<{ message: string }>('/auth/create-user', payload)
            return data
        },

        // Succès
        onSuccess: (res) => {
            toast.success(res.message || 'Utilisateur créé avec succès ')
        },

        // Erreur
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Erreur lors de la création de l'utilisateur",
            )
        },
    })
}
