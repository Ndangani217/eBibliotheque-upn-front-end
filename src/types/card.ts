/**
 * Type et énumérations pour la gestion des cartes d’abonnement
 */
export enum CardStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

/**
 * Représente une carte d’abonnement émise à un utilisateur
 */
export interface LibraryCard {
    id: string
    subscriberName: string
    category: string
    issuedAt: string
    expiresAt: string
    status: CardStatus
    qrCodeUrl?: string
}
