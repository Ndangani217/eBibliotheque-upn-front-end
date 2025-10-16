/** Rôles utilisateurs (mêmes valeurs que côté AdonisJS) */
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
