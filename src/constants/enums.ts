// src/constants/enums.ts

export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    MANAGER_VIEWER = 'manager_viewer',
    SUBSCRIBER = 'subscriber',
}

export enum SubscriberCategory {
    STUDENT = 'student',
    RESEARCHER = 'researcher',
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
