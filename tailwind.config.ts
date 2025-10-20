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
                border: 'var(--border)',
                ring: 'var(--ring)',

                /* Identité UPN */
                primary: {
                    DEFAULT: 'var(--color-primary)',
                    dark: 'var(--color-primary-dark)',
                },
                secondary: {
                    DEFAULT: 'var(--color-secondary)',
                    dark: 'var(--color-secondary-dark)',
                },

                /* États */
                success: 'var(--color-success)',
                warning: 'var(--color-warning)',
                danger: 'var(--color-danger)',
            },

            fontFamily: {
                sans: ['Inter', 'Roboto', 'sans-serif'],
            },

            borderRadius: {
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
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
