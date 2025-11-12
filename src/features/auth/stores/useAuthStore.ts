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

export const useAuthStore = create<AuthState>((set) => {
    const hydrate = async () => {
        set({ loading: true })
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

        if (!token) {
            set({ user: null, token: null, isAuthenticated: false, loading: false })
            return
        }

        try {
            console.log('🔑 Token localStorage:', token)
            const res = await api.get<{ data: { user: User } }>('/auth/me', {
                headers: { Authorization: `Bearer ${token}` },
            })

            const user = res.data.data.user

            if (!user) throw new Error('Utilisateur non trouvé dans la réponse')

            set({
                user,
                token,
                isAuthenticated: true,
                loading: false,
            })
        } catch (err) {
            console.error('Erreur hydrate :', err)
            if (typeof window !== 'undefined') localStorage.removeItem('token')
            set({ user: null, token: null, isAuthenticated: false, loading: false })
        }
    }

    return {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: true,
        setAuth: (user, token) => {
            if (typeof window !== 'undefined') localStorage.setItem('token', token)
            set({ user, token, isAuthenticated: true, loading: false })
        },
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        logout: () => {
            if (typeof window !== 'undefined') localStorage.removeItem('token')
            set({ user: null, token: null, isAuthenticated: false, loading: false })
        },
        hydrate,
    }
})

