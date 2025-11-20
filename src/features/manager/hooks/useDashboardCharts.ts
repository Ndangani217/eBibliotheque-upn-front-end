'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import type { Subscription } from '@/types/subscription'
import type { Payment } from './useManagerPayments'

type MonthKey = string // 'YYYY-MM'

function monthKey(date: Date): MonthKey {
	const y = date.getFullYear()
	const m = `${date.getMonth() + 1}`.padStart(2, '0')
	return `${y}-${m}`
}

function monthLabelFr(date: Date): string {
	return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
}

function parseDateFlexible(input?: string | null): Date | null {
	if (!input) return null
	// dd/MM/yyyy
	if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
		const [dd, mm, yyyy] = input.split('/')
		const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
		return isNaN(d.getTime()) ? null : d
	}
	// ISO-like or other
	const d = new Date(input)
	return isNaN(d.getTime()) ? null : d
}

function buildLastMonths(count = 6) {
	const out: { key: MonthKey; date: Date; label: string }[] = []
	const now = new Date()
	for (let i = count - 1; i >= 0; i -= 1) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
		out.push({ key: monthKey(d), date: d, label: monthLabelFr(d) })
	}
	return out
}

async function fetchAllPages<T>(url: string, pageKey: 'current_page' | 'currentPage' = 'current_page') {
	let page = 1
	const maxPages = 10 // garde‑fou
	const items: T[] = []

	while (true) {
		const { data } = await api.get(url.includes('?') ? `${url}&page=${page}` : `${url}?page=${page}`)
		const batch: T[] = data?.data ?? []
		items.push(...batch)

		const lastPage =
			data?.meta?.last_page ??
			data?.meta?.lastPage ??
			1
		const current =
			data?.meta?.[pageKey] ??
			data?.meta?.currentPage ??
			data?.meta?.current_page ??
			page

		if (current >= lastPage || page >= maxPages) break
		page += 1
	}
	return items
}

export function useDashboardCharts() {
	return useQuery({
		queryKey: ['manager-dashboard-charts'],
		queryFn: async () => {
			// Récupère paiements (validés + en attente)
			const [paymentsPending, paymentsPaid] = await Promise.all([
				fetchAllPages<Payment>('/manager/payments?status=en_attente', 'current_page'),
				fetchAllPages<Payment>('/manager/payments?status=paye', 'current_page'),
			])

			// Récupère abonnements (valides + expirés)
			const [subsActive, subsExpired] = await Promise.all([
				fetchAllPages<Subscription>('/manager/subscriptions?status=valide', 'currentPage'),
				fetchAllPages<Subscription>('/manager/subscriptions?status=expire', 'currentPage'),
			])

			// Buckets pour les 6 derniers mois
			const months = buildLastMonths(6)
			const subsByMonth = new Map<MonthKey, { actifs: number; expires: number }>()
			const payByMonth = new Map<MonthKey, { payes: number; enAttente: number }>()
			months.forEach(({ key }) => {
				subsByMonth.set(key, { actifs: 0, expires: 0 })
				payByMonth.set(key, { payes: 0, enAttente: 0 })
			})

			// Abonnements actifs: basé sur startDate
			for (const s of subsActive) {
				const d = parseDateFlexible(s.startDate)
				if (!d) continue
				const key = monthKey(new Date(d.getFullYear(), d.getMonth(), 1))
				if (subsByMonth.has(key)) {
					const v = subsByMonth.get(key)!
					v.actifs += 1
				}
			}
			// Abonnements expirés: basé sur endDate
			for (const s of subsExpired) {
				const d = parseDateFlexible(s.endDate)
				if (!d) continue
				const key = monthKey(new Date(d.getFullYear(), d.getMonth(), 1))
				if (subsByMonth.has(key)) {
					const v = subsByMonth.get(key)!
					v.expires += 1
				}
			}

			// Paiements validés: basé sur validatedAt si dispo, sinon createdAt
			for (const p of paymentsPaid) {
				const d = parseDateFlexible(p.validatedAt || p.createdAt)
				if (!d) continue
				const key = monthKey(new Date(d.getFullYear(), d.getMonth(), 1))
				if (payByMonth.has(key)) {
					const v = payByMonth.get(key)!
					v.payes += 1
				}
			}
			// Paiements en attente: basé sur createdAt
			for (const p of paymentsPending) {
				const d = parseDateFlexible(p.createdAt)
				if (!d) continue
				const key = monthKey(new Date(d.getFullYear(), d.getMonth(), 1))
				if (payByMonth.has(key)) {
					const v = payByMonth.get(key)!
					v.enAttente += 1
				}
			}

			const subscriptionTrend = months.map(({ key, label }) => ({
				month: label,
				actifs: subsByMonth.get(key)?.actifs ?? 0,
				expires: subsByMonth.get(key)?.expires ?? 0,
			}))

			const paymentActivity = months.map(({ key, label }) => ({
				month: label,
				payes: payByMonth.get(key)?.payes ?? 0,
				enAttente: payByMonth.get(key)?.enAttente ?? 0,
			}))

			return { subscriptionTrend, paymentActivity }
		},
		staleTime: 1000 * 60 * 5,
	})
}


