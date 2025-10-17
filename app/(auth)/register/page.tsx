'use client'

import RegisterFormAbonne from '@/features/auth/components/registerForm'

export default function RegisterPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-background text-text transition-colors duration-300 px-4">
            <section className="w-full max-w-md bg-surface border border-border shadow-card rounded-xl p-8 space-y-6 transition-colors duration-300">
                {/* En-tête avec logo et titre */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <img
                        src="/logo-upn.png"
                        alt="Logo UPN"
                        className="w-16 h-16 border border-border rounded-full p-1"
                    />
                    <h1 className="text-2xl font-semibold text-text">Bibliothèque UPN</h1>
                    <p className="text-sm text-text-secondary">
                        Créez un compte pour accéder à la plateforme
                    </p>
                </div>

                {/*  Formulaire d’inscription */}
                <RegisterFormAbonne />

                {/*  Lien vers la connexion */}
                <p className="text-center text-sm text-text-secondary mt-4">
                    Vous avez déjà un compte ?{' '}
                    <a
                        href="/login"
                        className="text-primary hover:text-primary-dark hover:underline transition-colors"
                    >
                        Connectez-vous ici
                    </a>
                </p>
            </section>
        </main>
    )
}
