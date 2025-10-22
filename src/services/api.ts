import axios from 'axios'
import { useAuthStore } from '@/features/auth'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://192.168.91.65:3333',

    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            console.error('Erreur réseau : le serveur est injoignable.')
        }
        return Promise.reject(error)
    },
)
export default api
