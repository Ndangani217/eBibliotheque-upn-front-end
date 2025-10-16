import '@/styles/index.css'
import { Providers } from '@/providers'

export const metadata = {
    title: 'Bibliothèque UPN',
    description: 'Gestion des abonnements et utilisateurs',
    icons: {
        icon: [{ url: '/logo-upn.png', type: 'image/png', sizes: '32x32' }],
        apple: '/logo-upn.png',
    },
    manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <head>
                {/* Fallback au cas où metadata ne s'applique pas */}
                <link rel="icon" href="/logo-upn.png" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            </head>
            <body
                style={{
                    backgroundColor: 'var(--background)',
                    color: 'var(--text)',
                }}
                className="min-h-screen transition-colors duration-200 dark:bg-gray-950 dark:text-gray-100"
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
