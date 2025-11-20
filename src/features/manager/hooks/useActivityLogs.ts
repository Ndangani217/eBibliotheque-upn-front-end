import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'

export interface ActivityLog {
	id: number
	userId: string
	role: string
	action: string
	entityType?: string | null
	entityId?: string | null
	metadata?: Record<string, unknown> | null
	ipAddress?: string | null
	userAgent?: string | null
	createdAt: string
}

interface ActivityLogsMeta {
	page: number
	limit: number
	total: number
	totalPages: number
}

export function useActivityLogs(page = 1, limit = 5) {
	return useQuery({
		queryKey: ['activity-logs', page, limit],
		queryFn: async () => {
			const res = await api.get('/manager/activity-logs', { params: { page, limit } })
			return res.data as { data: ActivityLog[]; meta: ActivityLogsMeta }
		},
	})
}


