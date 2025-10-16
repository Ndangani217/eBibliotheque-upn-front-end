'use client'

import { useAuth } from '@/features/auth'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { theme } from '@/constants/theme'
import { toast } from 'sonner'

export function LoginForm() {
    const { login, isLoggingIn } = useAuth()
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

    const baseInputClass =
        'border p-2 w-full rounded-lg focus:ring-2 transition-all duration-200 border-[var(--border)] focus:ring-[var(--color-primary)]'

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: undefined })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const newErrors: typeof errors = {}
        if (!form.email.trim()) newErrors.email = 'Veuillez entrer votre adresse e-mail.'
        if (!form.password.trim()) newErrors.password = 'Veuillez entrer votre mot de passe.'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            toast.error('Veuillez remplir tous les champs obligatoires.')
            return
        }

        login(form)
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="exemple@upn.cd"
                    value={form.email}
                    onChange={handleChange}
                    className={baseInputClass}
                    required
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Mot de passe */}
            <div className="space-y-2 relative">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        className={`${baseInputClass} pr-10`}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text)]"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Lien mot de passe oublié */}
            <div className="text-right">
                <Link
                    href="/auth/forgot-password"
                    className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                >
                    Mot de passe oublié ?
                </Link>
            </div>

            {/* Bouton de connexion */}
            <Button
                type="submit"
                disabled={isLoggingIn}
                style={{
                    backgroundColor: theme.colors.primary,
                    borderRadius: theme.radius.lg,
                    color: theme.colors.surface,
                    boxShadow: theme.shadows.button,
                }}
                className="w-full flex items-center justify-center gap-2 hover:brightness-105 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoggingIn ? (
                    <>
                        <Loader2 size={18} className="animate-spin" /> Connexion...
                    </>
                ) : (
                    'Se connecter'
                )}
            </Button>
        </form>
    )
}
