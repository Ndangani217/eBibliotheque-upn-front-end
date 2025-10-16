// 🎨 Thème global UPN – cohérent avec la charte visuelle et Tailwind

export const colors = {
    /** 🌈 Identité UPN */
    primary: '#60A5FA', // Bleu ciel professionnel
    primaryDark: '#3B82F6', // Bleu plus profond pour les hover
    secondary: '#FACC15', // Jaune UPN (accent)
    secondaryDark: '#EAB308', // Jaune plus chaud pour contraste

    /** ⚙️ États */
    success: '#22C55E', // Vert succès
    warning: '#FBBF24', // Jaune alerte
    danger: '#EF4444', // Rouge erreur

    /** 🩶 Fond & texte - mode clair */
    background: '#F9FAFB', // Gris clair
    surface: '#FFFFFF', // Fond des cartes/formulaires
    text: '#1E293B', // Texte principal
    textSecondary: '#475569', // Texte secondaire
    border: '#E2E8F0', // Gris clair pour séparations

    /** 🌙 Mode sombre */
    darkBackground: '#0F172A', // Bleu nuit
    darkSurface: '#1E293B', // Surface douce
    darkText: '#F8FAFC', // Texte clair
    darkTextSecondary: '#CBD5E1', // Texte secondaire clair
    darkBorder: '#334155', // Bordures sombres
}

export const typography = {
    /** Police par défaut */
    fontFamily: `'Inter', 'Roboto', sans-serif`,

    /** Tailles et styles */
    h1: 'text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100',
    h2: 'text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100',
    h3: 'text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-200',
    body: 'text-base sm:text-lg text-gray-700 dark:text-gray-300',
    small: 'text-sm sm:text-base text-gray-600 dark:text-gray-400',
}

export const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
}

export const shadows = {
    card: '0 2px 8px rgba(0, 0, 0, 0.05)',
    modal: '0 8px 24px rgba(0, 0, 0, 0.1)',
    button: '0 3px 6px rgba(59, 130, 246, 0.2)', // ombre bleue douce
}

export const radius = {
    sm: '0.375rem', // 6px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
}

export const breakpoints = {
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
}

/**
 * 🌐 Thème global exporté
 * Peut être importé dans tous les composants React :
 * import { theme } from '@/constants/theme'
 */
export const theme = {
    colors,
    typography,
    spacing,
    shadows,
    radius,
    breakpoints,
}
