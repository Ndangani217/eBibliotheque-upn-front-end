'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'

export interface ManagerDashboardStats {
    totalSubscribers: number
    activeSubscriptions: number
    expiredSubscriptions: number
    validatedPayments: number
    pendingPayments: number
}

export function useManagerDashboard() {
    return useQuery({
        queryKey: ['manager-dashboard'],
        queryFn: async () => {
            const { data } = await api.get('/manager/dashboard')
            return (data?.data ?? {}) as ManagerDashboardStats
        },
        staleTime: 1000 * 60 * 5,
    })
}
