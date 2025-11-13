import { toast } from 'sonner'
import type { AxiosError } from 'axios'

interface ApiErrorResponse {
    message?: string
    voucher?: {
        id?: number
        referenceCode?: string
        amount?: number
        status?: string
        createdAt?: string
        expiresAt?: string | null
    }
    subscription?: {
        id?: string
        startDate?: string
        endDate?: string
        status?: string
    }
}

interface CustomHandlers {
    onSubscriptionError?: (message: string) => void
    onVoucherError?: (message: string) => void
}

/**
 * Gère les erreurs API et affiche des messages toast appropriés
 * @param error - L'erreur Axios
 * @param defaultMessage - Message par défaut si aucun message spécifique n'est trouvé
 * @param customHandlers - Gestionnaires personnalisés pour des cas spécifiques
 */
export function handleApiError(
    error: unknown,
    defaultMessage: string = 'Une erreur est survenue',
    customHandlers?: CustomHandlers,
): void {
    const axiosError = error as AxiosError<ApiErrorResponse>
    const errorData = axiosError.response?.data

    if (errorData?.subscription && customHandlers?.onSubscriptionError) {
        customHandlers.onSubscriptionError(
            errorData.message || 'Vous avez déjà un abonnement actif. Veuillez attendre son expiration.',
        )
        return
    }

    if (errorData?.voucher && customHandlers?.onVoucherError) {
        customHandlers.onVoucherError(
            errorData.message || 'Vous avez déjà un bon de paiement actif. Veuillez attendre son expiration.',
        )
        return
    }

    const message = errorData?.message || axiosError.message || defaultMessage
    toast.error(message)
}

