'use client'

import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { theme } from '@/constants/theme'
import { useResetPassword } from '@/features/auth'
import { useState } from 'react'

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

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

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
    return (
        <main className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-950 px-4">
            <section className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-8 space-y-6 border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col items-center gap-2 text-center">
                    <img src="/logo-upn.png" alt="Logo UPN" className="w-16 h-16" />
                    <h1 className="text-2xl font-semibold">Nouveau mot de passe</h1>
                    <p className="text-sm text-gray-500">
                        Saisissez et confirmez votre nouveau mot de passe.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    {/* Nouveau mot de passe */}
                    <div className="space-y-2 relative">
                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                        <Input
                            id="newPassword"
                            type={show ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...register('newPassword')}
                            className="border p-2 w-full rounded-lg focus:ring-2 transition-all duration-200 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShow((p) => !p)}
                            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                        >
                            {show ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        {errors.newPassword && (
                            <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                        )}
                    </div>

                    {/* Confirmation */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                        <Input
                            id="confirmPassword"
                            type={show ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...register('confirmPassword')}
                            className="border p-2 w-full rounded-lg focus:ring-2 transition-all duration-200"
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>

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
                        {isPending ? <Loader2 className="animate-spin" /> : 'Confirmer'}
                    </Button>
                </form>
            </section>
        </main>
    )
}
