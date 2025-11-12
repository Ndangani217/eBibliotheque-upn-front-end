'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { theme } from '@/constants/theme'
import { useAuth } from '../hooks/useAuth'
import { SubscriberCategory } from '@/types/user'

/* -----------------------------
 * Validation du formulaire
 * ----------------------------- */
const schema = z.object({
    firstName: z.string().min(2, { message: 'Le prénom est requis' }),
    lastName: z.string().min(2, { message: 'Le nom est requis' }),
    email: z.string().email({ message: 'Adresse e-mail invalide' }),
    phoneNumber: z
        .string()
        .regex(/^(?:\+243|0)?[0-9]{9}$/, { message: 'Numéro invalide (+243 ou 0...)' }),
    category: z.enum(['student', 'researcher'], { message: 'Catégorie requise' }),
    matricule: z.string().optional(),
})

type FormData = z.infer<typeof schema>

/* -----------------------------
 * Composant principal
 * ----------------------------- */
export function RegisterForm() {
    const { register: registerUser, isRegistering } = useAuth()

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            category: 'student',
            matricule: '',
        },
    })

    const category = watch('category')

    const onSubmit = (data: FormData) => {
        const payload = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            category: data.category as SubscriberCategory,
            matricule: data.category === 'student' ? data.matricule : null,
        }

        registerUser(payload, {
            onSuccess: () => reset(),
        })
    }

    const baseInputClass =
        'border p-2 w-full rounded-lg focus:ring-2 transition-all duration-200 border-[var(--border)] focus:ring-[var(--color-primary)]'

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            {/* Prénom */}
            <div className="space-y-1">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                    id="firstName"
                    placeholder="Entrez votre prénom"
                    {...register('firstName')}
                    className={baseInputClass}
                />
                {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
            </div>

            {/* Nom */}
            <div className="space-y-1">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                    id="lastName"
                    placeholder="Entrez votre nom"
                    {...register('lastName')}
                    className={baseInputClass}
                />
                {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
            </div>

            {/* Email */}
            <div className="space-y-1">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="exemple@upn.cd"
                    {...register('email')}
                    className={baseInputClass}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Téléphone */}
            <div className="space-y-1">
                <Label htmlFor="phoneNumber">Téléphone</Label>
                <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+243 970 000 111"
                    {...register('phoneNumber')}
                    className={baseInputClass}
                />
                {errors.phoneNumber && (
                    <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
                )}
            </div>

            {/* Catégorie */}
            <div className="space-y-1">
                <Label htmlFor="category">Catégorie</Label>
                <Select
                    value={category}
                    onValueChange={(val) => setValue('category', val as 'student' | 'researcher')}
                >
                    <SelectTrigger className={baseInputClass}>
                        <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="student">Étudiant</SelectItem>
                        <SelectItem value="researcher">Chercheur</SelectItem>
                    </SelectContent>
                </Select>
                {errors.category && (
                    <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
            </div>

            {/* Matricule (si étudiant) */}
            {category === 'student' && (
                <div className="space-y-1">
                    <Label htmlFor="matricule">Matricule</Label>
                    <Input
                        id="matricule"
                        placeholder="Entrez votre matricule"
                        {...register('matricule')}
                        className={baseInputClass}
                    />
                </div>
            )}

            <p className="text-sm text-gray-500 text-center">
                Un lien sera envoyé à votre e-mail pour définir votre mot de passe.
            </p>

            <Button
                type="submit"
                disabled={isRegistering}
                className="w-full flex items-center justify-center gap-2 rounded-lg shadow-button transition-all duration-200 disabled:opacity-70"
                style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.surface,
                }}
            >
                {isRegistering ? (
                    <>
                        <Loader2 className="animate-spin w-4 h-4" /> Envoi...
                    </>
                ) : (
                    "S'inscrire"
                )}
            </Button>
        </form>
    )
}

