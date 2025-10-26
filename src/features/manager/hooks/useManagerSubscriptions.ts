'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'

export interface Subscription {
    id: string
    subscriberName: string
    type: string
    status: 'valide' | 'expire'
    startDate: string
    endDate: string
}

export function useManagerSubscriptions(status: 'valide' | 'expire' = 'valide') {
    return useQuery({
        queryKey: ['manager-subscriptions', status],
        queryFn: async () => {
            const { data } = await api.get(`/manager/subscriptions?status=${status}`)
            return data.data || []
        },
    })
}
