/** Statut d’un abonnement */
export enum SubscriptionStatus {
    VALIDE = 'valide',
    EXPIRE = 'expire',
    SUSPENDU = 'suspendu',
}

/** Structure d’un abonnement */
export interface Subscription {
    id: string
    subscriberName: string
    type: string
    status: SubscriptionStatus
    category: string
    startDate: string
    endDate: string
}
