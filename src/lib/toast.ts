/**
 * Système de toast amélioré avec messages guidés
 * Utilise le système de messages centralisé pour la cohérence
 */

import { toast as sonnerToast } from 'sonner'
import { getMessage, successMessages, errorMessages, warningMessages, infoMessages } from './messages'
import type { MessageType } from './messages'

/**
 * Toast de succès avec message guidé
 */
export function toastSuccess(
    key: keyof typeof successMessages,
    customMessage?: { title?: string; description?: string },
) {
    const message = getMessage(key, 'success')
    sonnerToast.success(customMessage?.title || message.title, {
        description: customMessage?.description || message.description,
        duration: 4000,
    })
}

/**
 * Toast d'erreur avec message guidé
 */
export function toastError(
    key: keyof typeof errorMessages,
    customMessage?: { title?: string; description?: string },
) {
    const message = getMessage(key, 'error')
    sonnerToast.error(customMessage?.title || message.title, {
        description: customMessage?.description || message.description,
        duration: 5000,
    })
}

/**
 * Toast d'avertissement avec message guidé
 */
export function toastWarning(
    key: keyof typeof warningMessages,
    customMessage?: { title?: string; description?: string },
) {
    const message = getMessage(key, 'warning')
    sonnerToast.warning(customMessage?.title || message.title, {
        description: customMessage?.description || message.description,
        duration: 4000,
    })
}

/**
 * Toast informatif avec message guidé
 */
export function toastInfo(
    key: keyof typeof infoMessages,
    customMessage?: { title?: string; description?: string },
) {
    const message = getMessage(key, 'info')
    sonnerToast.info(customMessage?.title || message.title, {
        description: customMessage?.description || message.description,
        duration: 4000,
    })
}

/**
 * Toast personnalisé
 */
export function toastCustom(
    type: MessageType,
    title: string,
    description?: string,
    duration?: number,
) {
    const toastFn = {
        success: sonnerToast.success,
        error: sonnerToast.error,
        warning: sonnerToast.warning,
        info: sonnerToast.info,
    }[type]

    toastFn(title, {
        description,
        duration: duration || 4000,
    })
}

// Export des fonctions de base pour compatibilité
export const toast = {
    success: toastSuccess,
    error: toastError,
    warning: toastWarning,
    info: toastInfo,
    custom: toastCustom,
    // Fonctions de base sonner pour cas spéciaux
    promise: sonnerToast.promise,
    loading: sonnerToast.loading,
    dismiss: sonnerToast.dismiss,
}

