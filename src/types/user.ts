// src/types/user.ts

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
