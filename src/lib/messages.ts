/**
 * Système de messages utilisateur
 * Messages clairs, positifs et guidés pour une meilleure UX
 */

export type MessageType = 'success' | 'error' | 'warning' | 'info'

export interface UserMessage {
    type: MessageType
    title: string
    description?: string
    action?: {
        label: string
        onClick: () => void
    }
}

/**
 * Messages de succès - Renforcer la confiance
 */
export const successMessages = {
    login: {
        title: 'Connexion réussie !',
        description: 'Bienvenue sur eBibliothèque UPN',
    },
    logout: {
        title: 'Déconnexion réussie',
        description: 'À bientôt !',
    },
    voucherGenerated: {
        title: 'Bon de paiement généré',
        description: 'Votre bon de paiement a été téléchargé avec succès',
    },
    paymentValidated: {
        title: 'Paiement validé',
        description: 'Votre abonnement est maintenant actif',
    },
    cardGenerated: {
        title: 'Carte générée',
        description: 'Votre carte d\'abonnement est prête',
    },
    subscriptionCreated: {
        title: 'Abonnement créé',
        description: 'Votre abonnement est maintenant actif',
    },
    userCreated: {
        title: 'Utilisateur créé',
        description: 'Un email a été envoyé pour définir le mot de passe',
    },
    passwordReset: {
        title: 'Email envoyé',
        description: 'Vérifiez votre boîte de réception pour réinitialiser votre mot de passe',
    },
    passwordChanged: {
        title: 'Mot de passe modifié',
        description: 'Votre mot de passe a été mis à jour avec succès',
    },
    profileUpdated: {
        title: 'Profil mis à jour',
        description: 'Vos informations ont été enregistrées',
    },
}

/**
 * Messages d'erreur - Guider l'utilisateur
 */
export const errorMessages = {
    loginFailed: {
        title: 'Échec de la connexion',
        description: 'Vérifiez votre email et votre mot de passe',
    },
    unauthorized: {
        title: 'Accès non autorisé',
        description: 'Veuillez vous connecter pour accéder à cette page',
    },
    networkError: {
        title: 'Erreur de connexion',
        description: 'Vérifiez votre connexion internet et réessayez',
    },
    serverError: {
        title: 'Erreur serveur',
        description: 'Une erreur est survenue. Veuillez réessayer plus tard',
    },
    validationError: {
        title: 'Données invalides',
        description: 'Veuillez vérifier les informations saisies',
    },
    voucherExists: {
        title: 'Bon déjà généré',
        description: 'Vous avez déjà un bon de paiement actif',
    },
    subscriptionActive: {
        title: 'Abonnement actif',
        description: 'Vous avez déjà un abonnement en cours',
    },
    cardExpired: {
        title: 'Carte expirée',
        description: 'Votre carte d\'abonnement a expiré',
    },
}

/**
 * Messages d'avertissement - Informer sans alarmer
 */
export const warningMessages = {
    voucherExpiring: {
        title: 'Bon expirant bientôt',
        description: 'Votre bon de paiement expire dans moins de 7 jours',
    },
    subscriptionExpiring: {
        title: 'Abonnement expirant',
        description: 'Votre abonnement expire bientôt. Pensez à le renouveler',
    },
    unsavedChanges: {
        title: 'Modifications non enregistrées',
        description: 'Vous avez des modifications non sauvegardées',
    },
}

/**
 * Messages informatifs - Guider l'utilisateur
 */
export const infoMessages = {
    loading: {
        title: 'Chargement en cours...',
        description: 'Veuillez patienter',
    },
    voucherPending: {
        title: 'Bon en attente',
        description: 'Votre bon de paiement est en attente de validation',
    },
    subscriptionPending: {
        title: 'Abonnement en attente',
        description: 'Votre abonnement est en cours de traitement',
    },
    emailVerification: {
        title: 'Vérification email',
        description: 'Un email de vérification vous a été envoyé',
    },
}

/**
 * Helper pour obtenir un message formaté
 */
export function getMessage(key: keyof typeof successMessages | keyof typeof errorMessages | keyof typeof warningMessages | keyof typeof infoMessages, type: MessageType = 'info'): UserMessage {
    const messages = {
        success: successMessages,
        error: errorMessages,
        warning: warningMessages,
        info: infoMessages,
    }

    const messageObj = messages[type][key as keyof typeof messages[typeof type]] as { title: string; description?: string; action?: { label: string; onClick: () => void } } | undefined
    if (!messageObj) {
        return {
            type,
            title: 'Message',
            description: 'Message non trouvé',
        }
    }
    return {
        type,
        title: messageObj.title || 'Message',
        description: messageObj.description,
        action: messageObj.action,
    }
}

