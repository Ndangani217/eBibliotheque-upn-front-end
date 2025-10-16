'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { theme } from '@/constants/theme'
import { Loader2 } from 'lucide-react'
import { useForgotPassword } from '@/features/auth/hooks'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')

    const { mutateAsync: forgotPassword, isPending } = useForgotPassword()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!email.trim()) {
            toast.error('Veuillez entrer votre adresse e-mail.')
            return
        }

        try {
            await forgotPassword({ email })
            toast.success('Lien de réinitialisation envoyé à votre adresse e-mail.')
            setEmail('')
        } catch (error) {
            console.error(error)
            toast.error("Impossible d'envoyer le lien de réinitialisation.")
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-950 px-4">
            <section className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-8 space-y-6 border border-gray-100 dark:border-gray-800">
                {/* Logo UPN */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <img src="/logo-upn.png" alt="Logo UPN" className="w-16 h-16" />
                    <h1 className="text-2xl font-semibold">Réinitialiser le mot de passe</h1>
                    <p className="text-sm text-gray-500">
                        Entrez votre e-mail pour recevoir un lien de réinitialisation
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Champ e-mail */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="exemple@upn.cd"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 w-full rounded-lg focus:ring-2 transition-all duration-200"
                        />
                    </div>

                    {/* Bouton d'envoi */}
                    <Button
                        type="submit"
                        disabled={isPending}
                        style={{
                            backgroundColor: theme.colors.primary,
                            borderRadius: theme.radius.lg,
                            color: theme.colors.surface,
                            boxShadow: theme.shadows.button,
                        }}
                        className="w-full flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="animate-spin" /> Envoi en cours...
                            </>
                        ) : (
                            'Envoyer le lien'
                        )}
                    </Button>
                </form>
            </section>
        </main>
    )
}
