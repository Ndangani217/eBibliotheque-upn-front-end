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
            console.log('🔑 Hydratation: Token trouvé dans localStorage')
            // Mettre le token dans le store temporairement pour que l'intercepteur puisse l'utiliser
            set({ token, loading: true })
            
            // L'intercepteur ajoutera automatiquement le token depuis le store
            const res = await api.get<{ data: { user: User } }>('/auth/me')

            const user = res.data.data.user

            if (!user) throw new Error('Utilisateur non trouvé dans la réponse')

            console.log('✅ Hydratation réussie:', user.email)
            set({
                user,
                token,
                isAuthenticated: true,
                loading: false,
            })
        } catch (err: unknown) {
            console.error('❌ Erreur hydrate :', err)
            // Ne pas supprimer le token si l'erreur est due à un problème réseau temporaire
            // Seulement si c'est une erreur 401 (non autorisé)
            const axiosError = err as { response?: { status?: number }; message?: string }
            if (axiosError.response?.status === 401) {
                console.warn('🔒 Token invalide lors de l\'hydratation (401), nettoyage...')
                if (typeof window !== 'undefined') localStorage.removeItem('token')
                set({ user: null, token: null, isAuthenticated: false, loading: false })
            } else {
                // Pour les autres erreurs (réseau, etc.), on garde le token mais on marque comme non authentifié
                // L'utilisateur pourra réessayer
                console.warn('⚠️ Erreur réseau lors de l\'hydratation, conservation du token')
                set({ loading: false })
            }
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

