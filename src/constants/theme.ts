// 🎨 Thème global UPN – cohérent avec la charte visuelle et Tailwind
// src/constants/theme.ts

export const colors = {
    /** 🌈 Identité UPN */
    primary: '#60A5FA', // Bleu ciel professionnel
    primaryDark: '#3B82F6', // Bleu plus profond (hover)
    secondary: '#FACC15', // Jaune UPN (accent)
    secondaryDark: '#EAB308', // Jaune chaud (contraste)

    /** ⚙️ États */
    success: '#22C55E',
    warning: '#FBBF24',
    danger: '#EF4444',

    /** 🩶 Fond & texte - mode clair */
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#475569',
    border: '#E2E8F0',

    /** 🌙 Mode sombre */
    darkBackground: '#0F172A',
    darkSurface: '#1E293B',
    darkText: '#F8FAFC',
    darkTextSecondary: '#CBD5E1',
    darkBorder: '#334155',
}

export const typography = {
    fontFamily: `'Inter', 'Roboto', sans-serif`,
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
    button: '0 3px 6px rgba(59, 130, 246, 0.2)',
}

export const radius = {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
}

export const breakpoints = {
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
}

/**
 * 🌐 Thème global exporté
 * Utilisable dans tous les composants :
 *   import { theme } from '@/constants/theme'
 */
export const theme = {
    colors,
    typography,
    spacing,
    shadows,
    radius,
    breakpoints,
}
