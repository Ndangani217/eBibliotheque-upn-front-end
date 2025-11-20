'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { theme } from '@/constants/theme'

import { useCreateUserByAdmin, type CreateAdminUserPayload } from '@/features/auth'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, UserPlus } from 'lucide-react'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'

const schema = z.object({
    firstName: z.string().min(2, { message: 'Prénom requis' }),
    lastName: z.string().min(2, { message: 'Nom requis' }),
    email: z.string().email({ message: 'Email invalide' }),
    role: z.enum(['admin', 'gestionnaire', 'gestionnaire_observateur']),
})

type FormData = z.infer<typeof schema>

export default function AdminRegisterUserForm() {
    const { mutateAsync: createUser, isPending } = useCreateUserByAdmin()

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            role: 'gestionnaire',
        },
    })

    const role = watch('role')

    // ✅ Soumission du formulaire
    const onSubmit = async (data: FormData) => {
        try {
            await createUser(data as CreateAdminUserPayload)
            toast.success('Utilisateur créé avec succès. Lien envoyé pour définir le mot de passe.')
            reset()
        } catch (error) {
            console.error(error)
            toast.error("Échec de la création de l'utilisateur.")
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-sm mx-auto space-y-4 p-6 rounded-[9px] shadow bg-white dark:bg-gray-900"
        >
            <h2
                className="text-xl font-semibold text-center"
                style={{ color: theme.colors.primaryDark }}
            >
                Créer un compte (Admin / Gestion)
            </h2>

            {/* Prénom */}
            <div className="space-y-1">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" placeholder="Entrez le prénom" {...register('firstName')} />
                {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
            </div>

            {/* Nom */}
            <div className="space-y-1">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" placeholder="Entrez le nom" {...register('lastName')} />
                {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
            </div>

            {/* Email */}
            <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="exemple@upn.cd"
                    {...register('email')}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Rôle */}
            <div className="space-y-1">
                <Label htmlFor="role">Rôle</Label>
                <Select
                    value={role}
                    onValueChange={(val) =>
                        setValue(
                            'role',
                            val as 'admin' | 'gestionnaire' | 'gestionnaire_observateur',
                        )
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="gestionnaire">Gestionnaire</SelectItem>
                        <SelectItem value="gestionnaire_observateur">
                            Gestionnaire Observateur
                        </SelectItem>
                    </SelectContent>
                </Select>
                {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
            </div>

            <p className="text-sm text-gray-500 text-center">
                Un lien sera envoyé à l’utilisateur pour définir son mot de passe.
            </p>

            {/* Bouton */}
            <Button
                type="submit"
                disabled={isPending}
                className="w-full font-semibold py-2 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                    backgroundColor: theme.colors.primaryDark,
                    color: theme.colors.surface,
                }}
            >
                {isPending ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Création...
                    </>
                ) : (
                    <>
                        <UserPlus className="w-4 h-4" />
                        Créer
                    </>
                )}
            </Button>
        </form>
    )
}
