'use client'

import Image from 'next/image'
import { RegisterForm } from '@/features/auth'

/**
 * Page d'inscription pour les étudiants
 * 
 * Cette page utilise le composant RegisterForm qui gère déjà :
 * - La validation du formulaire
 * - L'appel API via useRegisterSubscriber hook
 * - La redirection après succès
 * 
 * Structure conforme Next.js App Router :
 * - Pas d'import de route API comme module
 * - Utilisation des hooks React Query via useAuth
 * - Appels API centralisés dans src/services/api
 */
export default function RegisterStudentPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-background text-text transition-colors duration-300 px-4">
            <section className="w-full max-w-md bg-surface border border-border shadow-card p-8 space-y-6 transition-colors duration-300">
                {/* En-tête avec logo et titre */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <Image
                        src="/logo-upn.png"
                        alt="Logo UPN"
                        width={64}
                        height={64}
                        className="border border-border p-1"
                    />
                    <h1 className="text-2xl font-semibold text-text">Bibliothèque UPN</h1>
                    <p className="text-sm text-text-secondary">
                        Inscription Étudiant - Créez votre compte
                    </p>
                </div>

                {/* Formulaire d'inscription */}
                <RegisterForm />

                {/* Lien vers la connexion */}
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

