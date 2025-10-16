import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/user'

interface AuthState {
    user: User | null
    token: string | null
    setAuth: (user: User, token: string) => void
    logout: () => void
}

/**
 * Store global d'authentification
 * - Gère le token et les informations utilisateur
 * - Persiste dans localStorage
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,

            setAuth: (user, token) => {
                set({ user, token })
                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', token)
                }
            },

            logout: () => {
                set({ user: null, token: null })
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token')
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, token: state.token }),
        },
    ),
)
