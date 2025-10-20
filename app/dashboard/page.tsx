'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/features/auth/store'
import { Loader2 } from 'lucide-react'

export default function DashboardRedirectPage() {
    const router = useRouter()
    const { user } = useAuthStore()

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user) {
                router.push('/login')
                return
            }

            switch (user.role) {
                case 'admin':
                    router.push('/dashboard/admin')
                    break
                case 'manager':
                    router.push('/dashboard/manager')
                    break
                case 'manager_viewer':
                    router.push('/dashboard/manager-viewer')
                    break
                case 'subscriber':
                    router.push('/dashboard/subscriber')
                    break
                default:
                    router.push('/auth/login')
                    break
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [user, router])

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
            <Loader2 className="w-10 h-10 animate-spin mb-3 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
                Chargement de votre tableau de bord...
            </p>
        </div>
    )
}
