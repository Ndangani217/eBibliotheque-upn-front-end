'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, Mail } from 'lucide-react'
import { useForgotPassword } from '@/features/auth'

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
        <main className="min-h-screen flex items-center justify-center bg-background px-4 transition-colors duration-300">
            <section className="w-full max-w-md bg-surface border border-border shadow-card rounded-[9px] p-8 space-y-6 transition-colors duration-300">
                {/* Logo et titre */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <Image
                        src="/logo-upn.png"
                        alt="Logo UPN"
                        width={64}
                        height={64}
                    />
                    <h1 className="text-2xl font-semibold text-text">
                        Réinitialiser le mot de passe
                    </h1>
                    <p className="text-sm text-text-secondary">
                        Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
                    </p>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-text">
                            Adresse e-mail
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="exemple@upn.cd"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-border bg-surface text-text rounded-[9px] focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200"
                        />
                    </div>

                    {/* Bouton d’envoi */}
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-surface font-medium rounded-[9px] py-2 shadow-button transition-all duration-200"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="animate-spin w-5 h-5" />
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                <Mail className="w-5 h-5" />
                                Envoyer le lien
                            </>
                        )}
                    </Button>
                </form>
            </section>
        </main>
    )
}
