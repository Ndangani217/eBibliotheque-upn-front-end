'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/features/auth/store'
import { Loader2 } from 'lucide-react'

export default function DashboardRedirectPage() {
    const { user } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user) router.push('/auth/login')
            else if (user.role === 'admin') router.push('/dashboard/admin')
            else if (user.role === 'manager') router.push('/dashboard/manager')
            else if (user.role === 'manager_viewer') router.push('/dashboard/manager-viewer')
            else router.push('/dashboard/subscriber')
        }, 800)
        return () => clearTimeout(timer)
    }, [user, router])

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#f9fafb]">
            <Loader2
                className="w-10 h-10 animate-spin mb-3"
                style={{ color: 'var(--color-primary)' }}
            />
            <p className="text-sm font-medium" style={{ color: 'var(--color-primary-dark)' }}>
                Loading your dashboard...
            </p>
        </div>
    )
}
