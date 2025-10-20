'use client'

import { useAuthStore } from '@/features/auth'
import api from '@/services/api'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { User } from '@/types/user'
import type { AxiosError } from 'axios'

interface LoginPayload {
    email: string
    password: string
}

interface RegisterPayload {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    category: string
    role?: string
}

interface AuthResponse {
    token: string
    user: User
}

interface ApiError {
    status: string
    message: string
    errors?: Record<string, string[]>
}

export function useAuth() {
    const router = useRouter()
    const { user, token, setAuth, logout } = useAuthStore()

    // Connexion
    const loginMutation = useMutation<AuthResponse, AxiosError<ApiError>, LoginPayload>({
        mutationFn: async (credentials) => {
            const { data } = await api.post<AuthResponse>('/login', credentials)
            return data
        },
        onSuccess: (data) => {
            setAuth(data.user, data.token)
            toast.success('Connexion réussie')
            router.push('/dashboard')
        },
        onError: (error) => {
            const message = error.response?.data?.message ?? 'Erreur de connexion'
            toast.error(message)
        },
    })

    // Inscription
    const registerMutation = useMutation<void, AxiosError<ApiError>, RegisterPayload>({
        mutationFn: async (payload) => {
            await api.post('/register', payload)
        },
        onSuccess: () => {
            toast.success('Inscription réussie. Vérifiez votre email.')
            router.push('/login')
        },
        onError: (error) => {
            const message = error.response?.data?.message ?? 'Erreur lors de l’inscription'
            toast.error(message)
        },
    })

    // Déconnexion
    const handleLogout = async (): Promise<void> => {
        try {
            await api.delete('/auth/logout')
            logout()
            toast.info('Déconnexion réussie')
            router.push('/login')
        } catch {
            logout()
            toast.error('Erreur lors de la déconnexion')
        }
    }

    return {
        user,
        token,
        isAuthenticated: Boolean(token),
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        logout: handleLogout,
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
    }
}
