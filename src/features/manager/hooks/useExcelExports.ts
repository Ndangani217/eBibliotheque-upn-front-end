'use client'

import api from '@/services/api'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'

/**
 * Hook pour exporter les paiements en Excel
 */
export function useExportPayments() {
    const exportPayments = async (startDate: string, endDate: string) => {
        try {
            const response = await api.get('/manager/payments/export', {
                params: { startDate, endDate },
                responseType: 'blob',
            })

            // Créer un lien de téléchargement
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `paiements_${startDate}_${endDate}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>
            const message = axiosError.response?.data?.message || 'Erreur lors de l\'export'
            toast.error(message)
            throw error
        }
    }

    return { exportPayments }
}

/**
 * Hook pour exporter les abonnements actifs en Excel
 */
export function useExportActiveSubscriptions() {
    const exportActiveSubscriptions = async (startDate: string, endDate: string) => {
        try {
            const response = await api.get('/manager/subscriptions/active/export', {
                params: { startDate, endDate },
                responseType: 'blob',
            })

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `abonnements_actifs_${startDate}_${endDate}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>
            const message = axiosError.response?.data?.message || 'Erreur lors de l\'export'
            toast.error(message)
            throw error
        }
    }

    return { exportActiveSubscriptions }
}

/**
 * Hook pour exporter les abonnements expirés en Excel
 */
export function useExportExpiredSubscriptions() {
    const exportExpiredSubscriptions = async (startDate: string, endDate: string) => {
        try {
            const response = await api.get('/manager/subscriptions/expired/export', {
                params: { startDate, endDate },
                responseType: 'blob',
            })

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `abonnements_expires_${startDate}_${endDate}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>
            const message = axiosError.response?.data?.message || 'Erreur lors de l\'export'
            toast.error(message)
            throw error
        }
    }

    return { exportExpiredSubscriptions }
}

