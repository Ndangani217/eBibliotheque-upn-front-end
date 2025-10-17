'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useSetPassword } from '@/features/auth/hooks'
import { useState } from 'react'

const schema = z
    .object({
        password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['confirmPassword'],
    })

type FormData = z.infer<typeof schema>

export default function SetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const userId = searchParams.get('userId')
    const token = searchParams.get('token')

    const { mutateAsync: setPassword, isPending } = useSetPassword()
    const [show, setShow] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { password: '', confirmPassword: '' },
    })

    const onSubmit = async (data: FormData) => {
        if (!userId || !token) {
            toast.error('Lien invalide ou expiré.')
            return
        }

        try {
            await setPassword({
                token,
                newPassword: data.password,
                confirmPassword: data.confirmPassword,
            })
            toast.success('Mot de passe défini avec succès')
            router.push('/login')
        } catch (error) {
            console.error(error)
            toast.error('Erreur lors de la définition du mot de passe')
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-background px-4 transition-colors duration-300">
            <section className="w-full max-w-md bg-surface shadow-card rounded-xl p-8 space-y-6 border border-border transition-colors duration-300">
                {/* 🔷 En-tête */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <img src="/logo-upn.png" alt="Logo UPN" className="w-16 h-16" />
                    <h1 className="text-2xl font-semibold text-text">Définir un mot de passe</h1>
                    <p className="text-sm text-text-secondary">
                        Créez votre mot de passe pour activer votre compte
                    </p>
                </div>

                {/* 🧩 Formulaire */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    {/* Mot de passe */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-text">
                            Mot de passe
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={show ? 'text' : 'password'}
                                placeholder="••••••••"
                                {...register('password')}
                                className="border border-border bg-surface text-text w-full rounded-md focus:ring-2 focus:ring-primary focus:outline-none pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShow((s) => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                            >
                                {show ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-danger">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirmation */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-text">
                            Confirmer le mot de passe
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            {...register('confirmPassword')}
                            className="border border-border bg-surface text-text w-full rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-danger">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* ✅ Bouton d’envoi */}
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-surface font-medium rounded-lg py-2 shadow-button transition-all duration-200"
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                            'Définir le mot de passe'
                        )}
                    </Button>
                </form>
            </section>
        </main>
    )
}
