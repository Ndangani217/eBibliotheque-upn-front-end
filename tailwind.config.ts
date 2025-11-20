import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
    darkMode: 'class',
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],

    theme: {
        extend: {
            colors: {
                /* Couleurs globales pilotées par les variables CSS */
                background: 'var(--background)',
                surface: 'var(--surface)',
                text: 'var(--text)',
                'text-secondary': 'var(--text-secondary)',
                'text-muted': 'var(--text-muted)',
                border: 'var(--border)',
                ring: 'var(--ring)',

                /* Identité UPN - Couleurs officielles */
                primary: {
                    50: 'var(--color-primary-50)',
                    100: 'var(--color-primary-100)',
                    200: 'var(--color-primary-200)',
                    300: 'var(--color-primary-300)',
                    400: 'var(--color-primary-400)',
                    DEFAULT: 'var(--color-primary-500)', // #002F6C
                    600: 'var(--color-primary-600)',
                    700: 'var(--color-primary-700)',
                    800: 'var(--color-primary-800)',
                    900: 'var(--color-primary-900)',
                },
                secondary: {
                    50: 'var(--color-secondary-50)',
                    100: 'var(--color-secondary-100)',
                    200: 'var(--color-secondary-200)',
                    300: 'var(--color-secondary-300)',
                    400: 'var(--color-secondary-400)',
                    DEFAULT: 'var(--color-secondary-500)', // #FFCC00
                    600: 'var(--color-secondary-600)',
                    700: 'var(--color-secondary-700)',
                    800: 'var(--color-secondary-800)',
                    900: 'var(--color-secondary-900)',
                },

                /* États sémantiques */
                success: {
                    light: 'var(--color-success-light)',
                    DEFAULT: 'var(--color-success)',
                    dark: 'var(--color-success-dark)',
                },
                warning: {
                    light: 'var(--color-warning-light)',
                    DEFAULT: 'var(--color-warning)',
                    dark: 'var(--color-warning-dark)',
                },
                error: {
                    light: 'var(--color-error-light)',
                    DEFAULT: 'var(--color-error)',
                    dark: 'var(--color-error-dark)',
                },
                danger: 'var(--color-error)', // Alias pour compatibilité
                info: {
                    light: 'var(--color-info-light)',
                    DEFAULT: 'var(--color-info)',
                    dark: 'var(--color-info-dark)',
                },
            },

            fontFamily: {
                sans: ['Inter', 'Roboto', 'sans-serif'],
            },

            borderRadius: {
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
                app: 'var(--radius-app)', // 9px - Rayon uniforme pour l'application
            },

            boxShadow: {
                card: '0 2px 8px rgba(0,0,0,0.05)',
                modal: '0 8px 24px rgba(0,0,0,0.1)',
                button: '0 3px 6px rgba(59,130,246,0.2)',
            },

            /*Animation de clignotement du statut en ligne */
            keyframes: {
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.3' },
                },
            },
            animation: {
                blink: 'blink 1.2s infinite ease-in-out',
            },
        },
    },

    plugins: [animate],
}

export default config
