'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store'
import LayoutDashboard from '@/components/layouts/layoutDashboard'

export default function ProtectedDashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { isAuthenticated, loading, hydrate } = useAuthStore()

    useEffect(() => {
        hydrate()
    }, [hydrate])

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login')
        }
    }, [loading, isAuthenticated, router])

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
