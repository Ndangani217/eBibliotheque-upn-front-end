// src/constants/enums.ts

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

export enum VoucherStatus {
    EN_ATTENTE = 'en_attente',
    PAYE = 'payé',
    EXPIRE = 'expiré',
    ANNULE = 'annulé',
}

export enum SubscriptionStatus {
    VALIDE = 'valide',
    EXPIRE = 'expiré',
    SUSPENDU = 'suspendu',
}

export enum NotificationType {
    EXPIRATION_PROCHE = 'expiration_proche',
}

export enum NotificationChannel {
    APP = 'app',
}
