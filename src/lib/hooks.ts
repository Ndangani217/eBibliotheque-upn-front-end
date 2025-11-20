import { useAuthStore } from '@/features/auth'

/**
 * Hook utilitaire pour vérifier l'état d'authentification
 * @returns État d'authentification et token
 */
export function useAuthState() {
    const token = useAuthStore((state) => state.token)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const loading = useAuthStore((state) => state.loading)

    const hasToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
    const canFetch = !!hasToken && isAuthenticated && !loading

    return {
        token,
        isAuthenticated,
        loading,
        hasToken,
        canFetch,
    }
}

