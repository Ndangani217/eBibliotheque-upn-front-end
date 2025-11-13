'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth'
import LayoutDashboard from '@/components/layouts/layoutDashboard'

export default function ProtectedDashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { isAuthenticated, loading, hydrate, token, user } = useAuthStore()
    const [hasChecked, setHasChecked] = useState(false)

    useEffect(() => {
        // Vérifier localStorage directement au montage
        if (!hasChecked) {
            const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null
            
            console.log('🔍 Vérification auth:', { 
                storedToken: !!storedToken, 
                token: !!token, 
                user: !!user, 
                isAuthenticated,
                loading 
            })
            
            if (storedToken) {
                // On a un token dans localStorage
                if (token && user && isAuthenticated) {
                    // Tout est déjà en place dans le store, pas besoin d'hydrater
                    console.log('✅ Utilisateur déjà authentifié dans le store, pas d\'hydratation nécessaire')
                    setHasChecked(true)
                } else {
                    // On a un token mais pas dans le store, il faut hydrater
                    console.log('🔄 Hydratation nécessaire depuis localStorage')
                    hydrate().finally(() => setHasChecked(true))
                }
            } else {
                // Pas de token, utilisateur non authentifié
                console.log('❌ Pas de token dans localStorage')
                setHasChecked(true)
            }
        }
    }, [hasChecked, token, user, isAuthenticated, hydrate, loading])

    useEffect(() => {
        // Attendre que la vérification soit terminée avant de rediriger
        if (hasChecked && !loading && !isAuthenticated) {
            console.log('🚫 Redirection vers /login (non authentifié)')
            router.push('/login')
        }
    }, [hasChecked, loading, isAuthenticated, router])

    // Pendant que le store charge => pas de redirection
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-primary">
                Vérification de la session...
            </div>
        )
    }

    // Une fois hydraté, afficher le vrai layout
    if (isAuthenticated) {
        return <LayoutDashboard>{children}</LayoutDashboard>
    }

    // sinon => rien (la redirection s’est déjà faite)
    return null
}
