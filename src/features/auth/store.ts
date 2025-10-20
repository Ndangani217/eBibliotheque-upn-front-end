'use client'

import { create } from 'zustand'
import type { User } from '@/types/user'
import api from '@/services/api'

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    loading: boolean
    setAuth: (user: User, token: string) => void
    setUser: (user: User) => void
    logout: () => void
    hydrate: () => Promise<void>
}

/**
 * Store global d'authentification pour la Bibliothèque UPN
 * - Gère le token, l'utilisateur et l'état d'hydratation
 * - Évite la redirection intempestive vers /login
 */
export const useAuthStore = create<AuthState>((set) => {
    const hydrate = async () => {
        set({ loading: true })
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

        if (!token) {
            set({ user: null, token: null, isAuthenticated: false, loading: false })
            return
        }

        try {
            console.log('Token localStorage:', localStorage.getItem('token'))
            const res = await api.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` },
            })

            const user: User = res.data?.data?.user || res.data?.user

            if (user) {
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    loading: false,
                })
            } else {
                throw new Error('Utilisateur non trouvé dans la réponse')
            }
        } catch (err) {
            console.error('Erreur hydrate :', err)
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token')
            }
            set({ user: null, token: null, isAuthenticated: false, loading: false })
        }
    }

    return {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: true,

        setAuth: (user, token) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', token)
            }
            set({ user, token, isAuthenticated: true, loading: false })
        },

        setUser: (user) => {
            set({ user, isAuthenticated: !!user })
        },

        logout: () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token')
            }
            set({ user: null, token: null, isAuthenticated: false, loading: false })
        },

        hydrate,
    }
})
