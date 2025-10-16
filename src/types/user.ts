export enum UserRole {
    ADMIN = 'admin',
    GESTIONNAIRE = 'gestionnaire',
    GESTIONNAIRE_OBSERVATEUR = 'gestionnaire_observateur',
    ABONNE = 'abonne',
}

export enum SubscriberCategory {
    ETUDIANT = 'étudiant',
    CHERCHEUR = 'chercheur',
}

export interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    role: UserRole
    category?: SubscriberCategory | null
    isVerified: boolean
    isBlocked: boolean
    matricule?: string | null
    createdAt?: string
    updatedAt?: string
}
