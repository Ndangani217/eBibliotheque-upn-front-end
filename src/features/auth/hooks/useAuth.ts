'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'
import { authApi, usersApi } from '@/services/api'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import type { User, UserRole, SubscriberCategory } from '@/types/user'
import type { ApiErrorResponse } from '@/types/api'

interface LoginPayload {
    email: string
    password: string
}

interface RegisterSubscriberPayload {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    category: SubscriberCategory
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
    role: UserRole
}

interface AuthResponse {
    token: string
    user: User
}

export function useLogin() {
    const router = useRouter()
    const setAuth = useAuthStore((s) => s.setAuth)

    return useMutation<AuthResponse, AxiosError<ApiErrorResponse>, LoginPayload>({
        mutationFn: async (payload) => {
            const result = await authApi.login(payload)
            const token = result.accessToken.token
            const user = result.user
            if (!token || !user) {
                throw new Error('Token or user missing in response')
            }
            return { user, token }
        },
        onSuccess: ({ user, token }) => {
            console.log('Token reçu:', token)
            setAuth(user, token)
            toast.success('Connexion réussie')
            router.push('/dashboard')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Erreur de connexion.')
        },
    })
}

export function useLogout() {
    const router = useRouter()
    const { logout } = useAuthStore()
    return useMutation<void, AxiosError<ApiErrorResponse>, void>({
        mutationFn: async () => {
            try {
                await authApi.logout()
            } catch (err) {
                console.warn('Déconnexion backend échouée (token expiré ?), nettoyage local.')
            }
        },
        onSuccess: () => {
            logout()
            toast.success('Déconnexion réussie')
            router.push('/login')
        },
        onError: (error) => {
            console.error('Erreur de déconnexion :', error)
            logout()
            toast.error(
                error.response?.data?.message ||
                    'Erreur lors de la déconnexion. Session terminée localement.',
            )
            router.push('/login')
        },
    })
}

export function useAuthenticatedUser() {
    const token = useAuthStore((s) => s.token)
    const setUser = useAuthStore((s) => s.setUser)

    return useQuery<User, AxiosError<ApiErrorResponse>>({
        queryKey: ['auth', 'me'],
        queryFn: async () => {
            const user = await authApi.getMe()
            setUser(user)
            return user
        },
        enabled: !!token,
    })
}

export function useRegisterSubscriber() {
    const router = useRouter()

    return useMutation<
        { message: string },
        AxiosError<ApiErrorResponse>,
        RegisterSubscriberPayload
    >({
        mutationFn: async (payload) => {
            const result = await usersApi.registerSubscriber(payload)
            return { message: result.message }
        },
        onSuccess: (res) => {
            toast.success(res.message || 'Inscription réussie. Vérifiez votre e-mail 📩')
            router.push('/login')
        },
        onError: (error) =>
            toast.error(error.response?.data?.message || "Erreur lors de l'inscription."),
    })
}

export function useForgotPassword() {
    return useMutation<{ message: string }, AxiosError<ApiErrorResponse>, ForgotPasswordPayload>({
        mutationFn: async (payload) => {
            const result = await authApi.requestPasswordReset(payload)
            return { message: result.message }
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
    return useMutation<{ message: string }, AxiosError<ApiErrorResponse>, ResetPasswordPayload>({
        mutationFn: async (payload) => {
            const result = await authApi.resetPassword(payload.token, {
                newPassword: payload.newPassword,
            })
            return { message: result.message }
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
    return useMutation<{ message: string }, AxiosError<ApiErrorResponse>, ResetPasswordPayload>({
        mutationFn: async (payload) => {
            const result = await authApi.setPassword(payload.token, {
                newPassword: payload.newPassword,
            })
            return { message: result.message }
        },
        onSuccess: (res) => {
            toast.success(res.message || 'Mot de passe défini avec succès')
        },
        onError: (error) =>
            toast.error(
                error.response?.data?.message || 'Erreur lors de la définition du mot de passe',
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
 *  Hook pour la création d'un utilisateur par un administrateur
 */
export function useCreateUserByAdmin() {
    return useMutation<{ message: string }, AxiosError<ApiErrorResponse>, CreateAdminUserPayload>({
        // Appel API
        mutationFn: async (payload) => {
            const result = await usersApi.create(payload)
            return { message: result.message }
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
