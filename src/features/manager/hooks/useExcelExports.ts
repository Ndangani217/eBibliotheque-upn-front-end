'use client'

import api from '@/services/api'
import { downloadBlob } from '@/lib/fileDownload'
import { handleApiError } from '@/lib/errorHandler'

/**
 * Hook générique pour exporter des fichiers Excel
 */
function useExportExcel(endpoint: string, filenamePrefix: string) {
    const exportFile = async (startDate: string, endDate: string) => {
        try {
            const response = await api.get(endpoint, {
                params: { startDate, endDate },
                responseType: 'blob',
            })

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })
            downloadBlob(blob, `${filenamePrefix}_${startDate}_${endDate}.xlsx`)
        } catch (error) {
            handleApiError(error, 'Erreur lors de l\'export')
            throw error
        }
    }

    return { exportFile }
}

/**
 * Hook pour exporter les paiements en Excel
 */
export function useExportPayments() {
    const { exportFile } = useExportExcel('/manager/payments/export', 'paiements')
    return { exportPayments: exportFile }
}

/**
 * Hook pour exporter les abonnements actifs en Excel
 */
export function useExportActiveSubscriptions() {
    const { exportFile } = useExportExcel('/manager/subscriptions/active/export', 'abonnements_actifs')
    return { exportActiveSubscriptions: exportFile }
}

/**
 * Hook pour exporter les abonnements expirés en Excel
 */
export function useExportExpiredSubscriptions() {
    const { exportFile } = useExportExcel('/manager/subscriptions/expired/export', 'abonnements_expires')
    return { exportExpiredSubscriptions: exportFile }
}

