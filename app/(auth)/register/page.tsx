'use client'

import RegisterFormAbonne from '@/features/auth/components/registerForm'

export default function RegisterPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-950 px-4">
            <section className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-8 space-y-6 border border-gray-100 dark:border-gray-800">
                {/* 🔹 En-tête avec logo et titre */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <img
                        src="/logo-upn.png"
                        alt="Logo UPN"
                        className="w-16 h-16 border border-gray-200 dark:border-gray-700"
                    />
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Bibliothèque UPN
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Créez un compte pour accéder à la plateforme
                    </p>
                </div>

                {/* 🔹 Formulaire d’inscription */}
                <RegisterFormAbonne />

                {/* 🔹 Lien vers la connexion */}
                <p className="text-center text-sm text-gray-500 mt-4">
                    Vous avez déjà un compte ?{' '}
                    <a href="/login" className="text-primary hover:underline">
                        Connectez-vous ici
                    </a>
                </p>
            </section>
        </main>
    )
}
