/**
 * Design Tokens - eBibliothèque UPN
 * 
 * Système de design cohérent basé sur la charte graphique officielle UPN
 * Optimisé pour mobile-first et expérience utilisateur confiante
 */

// ============================================
// COULEURS UPN OFFICIELLES
// ============================================
export const upnColors = {
    // Bleu institutionnel UPN
    primary: {
        50: '#E6F0F7',
        100: '#CCE1EF',
        200: '#99C3DF',
        300: '#66A5CF',
        400: '#3387BF',
        500: '#002F6C', // Couleur principale officielle UPN
        600: '#002559',
        700: '#001C47',
        800: '#001235',
        900: '#000923',
    },
    // Jaune UPN officiel
    secondary: {
        50: '#FFF9E6',
        100: '#FFF3CC',
        200: '#FFE799',
        300: '#FFDB66',
        400: '#FFCF33',
        500: '#FFCC00', // Couleur secondaire officielle UPN
        600: '#CCA300',
        700: '#997A00',
        800: '#665200',
        900: '#332900',
    },
    // États sémantiques
    semantic: {
        success: {
            light: '#D1FAE5',
            DEFAULT: '#10B981',
            dark: '#059669',
        },
        warning: {
            light: '#FEF3C7',
            DEFAULT: '#F59E0B',
            dark: '#D97706',
        },
        error: {
            light: '#FEE2E2',
            DEFAULT: '#EF4444',
            dark: '#DC2626',
        },
        info: {
            light: '#DBEAFE',
            DEFAULT: '#3B82F6',
            dark: '#2563EB',
        },
    },
    // Neutres pour fonds et textes
    neutral: {
        white: '#FFFFFF',
        gray50: '#F9FAFB',
        gray100: '#F3F4F6',
        gray200: '#E5E7EB',
        gray300: '#D1D5DB',
        gray400: '#9CA3AF',
        gray500: '#6B7280',
        gray600: '#4B5563',
        gray700: '#374151',
        gray800: '#1F2937',
        gray900: '#111827',
        black: '#000000',
    },
}

// ============================================
// TYPOGRAPHIE
// ============================================
export const typography = {
    fontFamily: {
        sans: ['Inter', 'Roboto', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Fira Code', 'Monaco', 'monospace'],
    },
    fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
        base: ['1rem', { lineHeight: '1.5rem' }],      // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
    },
    fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
}

// ============================================
// ESPACEMENTS (Mobile-first)
// ============================================
export const spacing = {
    // Base: 4px (0.25rem)
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
}

// ============================================
// RAYONS DE BORDURE (Uniforme 9px)
// ============================================
export const borderRadius = {
    none: '0',
    sm: '0.25rem',      // 4px
    DEFAULT: '0.5625rem', // 9px - Standard UPN
    md: '0.5625rem',    // 9px
    lg: '0.5625rem',    // 9px
    xl: '0.75rem',      // 12px
    '2xl': '1rem',      // 16px
    full: '9999px',
}

// ============================================
// OMBRES (Confiance et profondeur)
// ============================================
export const shadows = {
    sm: '0 1px 2px 0 rgba(0, 47, 108, 0.05)',
    DEFAULT: '0 2px 8px 0 rgba(0, 47, 108, 0.08)',
    md: '0 4px 12px 0 rgba(0, 47, 108, 0.1)',
    lg: '0 8px 24px 0 rgba(0, 47, 108, 0.12)',
    xl: '0 16px 48px 0 rgba(0, 47, 108, 0.15)',
    inner: 'inset 0 2px 4px 0 rgba(0, 47, 108, 0.06)',
    none: 'none',
}

// ============================================
// BREAKPOINTS (Mobile-first)
// ============================================
export const breakpoints = {
    xs: '0px',      // Mobile portrait
    sm: '480px',    // Mobile landscape
    md: '768px',    // Tablet
    lg: '1024px',   // Desktop
    xl: '1280px',   // Large desktop
    '2xl': '1536px', // Extra large desktop
}

// ============================================
// TRANSITIONS (Fluidité)
// ============================================
export const transitions = {
    fast: '150ms ease-in-out',
    DEFAULT: '200ms ease-in-out',
    slow: '300ms ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
}

// ============================================
// Z-INDEX (Hiérarchie visuelle)
// ============================================
export const zIndex = {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
}

// ============================================
// EXPORT GLOBAL
// ============================================
export const designTokens = {
    colors: upnColors,
    typography,
    spacing,
    borderRadius,
    shadows,
    breakpoints,
    transitions,
    zIndex,
}

export default designTokens

