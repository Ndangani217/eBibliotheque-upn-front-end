'use client'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Eye, EyeOff, KeyRound, AlertCircle, Mail } from 'lucide-react'
import { useResetPassword } from '@/features/auth'
import { useState, useEffect } from 'react'
import { authApi } from '@/services/api'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'

// Désactiver le pré-rendu pour cette page dynamique
export const dynamic = 'force-dynamic'

const schema = z
    .object({
        newPassword: z
            .string()
            .min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
        confirmPassword: z.string().min(6, { message: 'Confirmation requise.' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Les mots de passe ne correspondent pas.',
    })

type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
    const { token } = useParams<{ token: string }>()
    const router = useRouter()
    const { mutate: resetPassword, isPending } = useResetPassword()
    const [show, setShow] = useState(false)
    const [isValidating, setIsValidating] = useState(true)
    const [isTokenValid, setIsTokenValid] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    // Vérifier la validité du token au chargement
    useEffect(() => {
        if (!token) {
            setIsValidating(false)
            setIsTokenValid(false)
            return
        }

        const verifyToken = async () => {
            try {
                await authApi.verifyResetToken(token)
                setIsTokenValid(true)
            } catch (error: unknown) {
                setIsTokenValid(false)
                if (isAxiosError(error) && error.response?.status === 404) {
                    toast.error('Lien de réinitialisation invalide ou expiré.')
                    setTimeout(() => router.push('/forgot-password'), 2000)
                }
            } finally {
                setIsValidating(false)
            }
        }

        verifyToken()
    }, [token, router])

    const onSubmit = (data: FormData) => {
        resetPassword(
            {
                token,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            },
            {
                onSuccess: () => {
                    reset()
                    setTimeout(() => router.push('/login'), 1500)
                },
            },
        )
    }
    // Affichage pendant la vérification du token
    if (isValidating) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background text-text transition-colors duration-300 px-4">
                <section className="w-full max-w-md bg-surface border border-border shadow-card rounded-[9px] p-8 space-y-6 transition-colors duration-300">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm text-text-secondary">Vérification du lien...</p>
                    </div>
                </section>
            </main>
        )
    }

    // Affichage si le token est invalide
    if (!isTokenValid) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background text-text transition-colors duration-300 px-4">
                <section className="w-full max-w-md bg-surface border border-border shadow-card rounded-[9px] p-8 space-y-6 transition-colors duration-300">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <AlertCircle className="w-12 h-12 text-danger" />
                        <h1 className="text-2xl font-semibold text-text">Lien invalide ou expiré</h1>
                        <p className="text-sm text-text-secondary">
                            Ce lien de réinitialisation n&apos;est plus valide. Veuillez demander un nouveau lien.
                        </p>
                        <Button
                            onClick={() => router.push('/forgot-password')}
                            className="mt-4 flex items-center gap-2 bg-primary hover:bg-primary-dark text-surface font-medium rounded-[9px] py-2 shadow-button transition-all duration-200"
                        >
                            <Mail className="w-4 h-4" />
                            Demander un nouveau lien
                        </Button>
                    </div>
                </section>
            </main>
        )
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-background text-text transition-colors duration-300 px-4">
            <section className="w-full max-w-md bg-surface border border-border shadow-card rounded-[9px] p-8 space-y-6 transition-colors duration-300">
                {/* Logo et titre */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <Image
                        src="/logo-upn.png"
                        alt="Logo UPN"
                        width={64}
                        height={64}
                        className="border border-border rounded-full p-1"
                    />
                    <h1 className="text-2xl font-semibold text-text">Nouveau mot de passe</h1>
                    <p className="text-sm text-text-secondary">
                        Saisissez et confirmez votre nouveau mot de passe.
                    </p>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    {/* Nouveau mot de passe */}
                    <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-text">
                            Nouveau mot de passe
                        </Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={show ? 'text' : 'password'}
                                placeholder="••••••••"
                                {...register('newPassword')}
                                className="border border-border bg-surface text-text w-full rounded-[9px] focus:ring-2 focus:ring-primary focus:outline-none pr-10 transition-all duration-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShow((p) => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                            >
                                {show ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-sm text-danger">{errors.newPassword.message}</p>
                        )}
                    </div>

                    {/* Confirmation */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-text">
                            Confirmer le mot de passe
                        </Label>
                        <Input
                            id="confirmPassword"
                            type={show ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...register('confirmPassword')}
                            className="border border-border bg-surface text-text w-full rounded-[9px] focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200"
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-danger">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Bouton d'envoi */}
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-surface font-medium rounded-[9px] py-2 shadow-button transition-all duration-200"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="animate-spin w-5 h-5" />
                                Confirmation...
                            </>
                        ) : (
                            <>
                                <KeyRound className="w-5 h-5" />
                                Confirmer
                            </>
                        )}
                    </Button>
                </form>
            </section>
        </main>
    )
}
