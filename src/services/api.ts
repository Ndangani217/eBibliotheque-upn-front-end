/**
 * Point d'entrée principal pour les services API
 * Exporte l'instance axios et tous les services API
 */
export { default as api } from './apiClient'
export { authApi } from './api/auth.api'
export { usersApi } from './api/users.api'

// Export par défaut pour compatibilité avec les anciens imports
export { default } from './apiClient'
