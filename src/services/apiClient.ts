import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { useAuthStore } from '@/features/auth'

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
    // Récupérer le token depuis le store, ou depuis localStorage comme fallback
    const token = useAuthStore.getState().token || 
                  (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log('🔑 Token ajouté aux headers:', token.substring(0, 20) + '...')
    } else {
        console.warn('⚠️ Pas de token disponible pour la requête:', config.url)
    }
    return config
})

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        const status = error.response?.status
        if (status === 401) {
            const authState = useAuthStore.getState()
            const requestUrl = error.config?.url || 'unknown'
            const token = authState.token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
            
            console.warn('⚠️ Erreur 401 détectée:', { 
                url: requestUrl,
                isAuthenticated: authState.isAuthenticated,
                hasToken: !!token,
                hasTokenInStore: !!authState.token,
                hasTokenInLocalStorage: !!(typeof window !== 'undefined' ? localStorage.getItem('token') : null)
            })
            
            // Ne déconnecter que si :
            // 1. L'utilisateur est actuellement authentifié
            // 2. Le token existe (store ou localStorage)
            // 3. Ce n'est pas une requête d'hydratation (/auth/me)
            // 4. Ce n'est pas une requête qui peut échouer normalement (404 pour /cards/active par exemple)
            const isHydrationRequest = requestUrl.includes('/auth/me')
            const isOptionalRequest = requestUrl.includes('/cards/active') // Peut retourner 404 si pas de carte
            
            if (authState.isAuthenticated && token && !isHydrationRequest && !isOptionalRequest) {
                // Vérifier si le token est vraiment invalide en vérifiant la réponse du serveur
                const errorMessage = (error.response?.data as { message?: string } | undefined)?.message || ''
                const isTokenExpired = errorMessage.toLowerCase().includes('token') || 
                                     errorMessage.toLowerCase().includes('expiré') ||
                                     errorMessage.toLowerCase().includes('invalid') ||
                                     errorMessage.toLowerCase().includes('unauthorized')
                
                if (isTokenExpired) {
                    console.warn('🔒 Token expiré ou invalide — déconnexion.', { url: requestUrl, message: errorMessage })
                    authState.logout()
                } else {
                    console.warn('⚠️ Erreur 401 mais message ne suggère pas expiration du token, pas de déconnexion', { 
                        url: requestUrl, 
                        message: errorMessage 
                    })
                }
            } else {
                console.warn('⚠️ Erreur 401 mais pas de déconnexion (conditions non remplies):', { 
                    isAuthenticated: authState.isAuthenticated, 
                    hasToken: !!token,
                    isHydrationRequest,
                    isOptionalRequest,
                    url: requestUrl 
                })
            }
        }
        return Promise.reject(error)
    },
)

export default api

