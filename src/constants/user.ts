/**
 * 📘 Constantes et types relatifs aux utilisateurs (rôles, catégories, statuts)
 * Strictement typé, sans "any"
 */

/** Rôles des utilisateurs */
export enum UserRole {
    ADMIN = 'admin',
    GESTIONNAIRE = 'gestionnaire',
    GESTIONNAIRE_OBSERVATEUR = 'gestionnaire_observateur',
    ABONNE = 'abonne',
}

/** Catégories d’abonnés */
export enum SubscriberCategory {
    ETUDIANT = 'étudiant',
    CHERCHEUR = 'chercheur',
}

/** Statuts du compte utilisateur */
export enum UserStatus {
    ACTIF = 'actif',
    BLOQUE = 'bloqué',
    NON_VERIFIE = 'non_vérifié',
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'Administrateur',
    [UserRole.GESTIONNAIRE]: 'Gestionnaire',
    [UserRole.GESTIONNAIRE_OBSERVATEUR]: 'Gestionnaire observateur',
    [UserRole.ABONNE]: 'Abonné',
}

export const SUBSCRIBER_CATEGORY_LABELS: Record<SubscriberCategory, string> = {
    [SubscriberCategory.ETUDIANT]: 'Étudiant',
    [SubscriberCategory.CHERCHEUR]: 'Chercheur',
}

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
    [UserStatus.ACTIF]: 'Actif',
    [UserStatus.BLOQUE]: 'Bloqué',
    [UserStatus.NON_VERIFIE]: 'Non vérifié',
}

export const USER_ROLE_COLORS: Record<UserRole, string> = {
    [UserRole.ADMIN]: '#0033CC', // Bleu officiel UPN
    [UserRole.GESTIONNAIRE]: '#2563EB', // Bleu clair
    [UserRole.GESTIONNAIRE_OBSERVATEUR]: '#1E40AF', // Bleu foncé
    [UserRole.ABONNE]: '#10B981', // Vert succès
}

export const USER_STATUS_COLORS: Record<UserStatus, string> = {
    [UserStatus.ACTIF]: '#16A34A', // Vert
    [UserStatus.BLOQUE]: '#DC2626', // Rouge
    [UserStatus.NON_VERIFIE]: '#FACC15', // Jaune
}

export interface Option<T extends string> {
    label: string
    value: T
}

export const USER_ROLE_OPTIONS: Option<UserRole>[] = Object.values(UserRole).map((role) => ({
    label: USER_ROLE_LABELS[role],
    value: role,
}))

export const SUBSCRIBER_CATEGORY_OPTIONS: Option<SubscriberCategory>[] = Object.values(
    SubscriberCategory,
).map((cat) => ({
    label: SUBSCRIBER_CATEGORY_LABELS[cat],
    value: cat,
}))

export const USER_STATUS_OPTIONS: Option<UserStatus>[] = Object.values(UserStatus).map(
    (status) => ({
        label: USER_STATUS_LABELS[status],
        value: status,
    }),
)

export const userConstants = {
    roles: UserRole,
    categories: SubscriberCategory,
    statuses: UserStatus,
    labels: {
        role: USER_ROLE_LABELS,
        category: SUBSCRIBER_CATEGORY_LABELS,
        status: USER_STATUS_LABELS,
    },
    colors: {
        role: USER_ROLE_COLORS,
        status: USER_STATUS_COLORS,
    },
    options: {
        roles: USER_ROLE_OPTIONS,
        categories: SUBSCRIBER_CATEGORY_OPTIONS,
        statuses: USER_STATUS_OPTIONS,
    },
}

export default userConstants
