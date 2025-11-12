'use client'

import { LoginForm } from '@/features/auth'

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-background text-text transition-colors duration-300 px-4">
            <section className="w-full max-w-md bg-surface border border-border shadow-card rounded-xl p-8 space-y-6 transition-colors duration-300">
                {/*  Logo & titre */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <img
                        src="/logo-upn.png"
                        alt="Logo UPN"
                        className="w-16 h-16 border border-border rounded-full p-1"
                    />
                    <h1 className="text-2xl font-semibold text-text">Bibliothèque UPN</h1>
                    <p className="text-sm text-text-secondary">Connectez-vous à votre compte</p>
                </div>

                {/* Formulaire de connexion */}
                <LoginForm />

                {/* Pied de page */}
                <p className="text-center text-sm text-text-secondary mt-4">
                    Vous n’avez pas de compte ?{' '}
                    <a
                        href="/register"
                        className="text-primary hover:text-primary-dark hover:underline"
                    >
                        Créez-en un ici
                    </a>
                </p>
            </section>
        </main>
    )
}
