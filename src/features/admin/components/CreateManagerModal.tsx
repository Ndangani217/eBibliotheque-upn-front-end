'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { toast } from 'sonner'

/* ----------------------------
 * 1Schéma de validation
 * ---------------------------- */
const managerSchema = z.object({
    firstName: z.string().min(2, 'Prénom trop court'),
    lastName: z.string().min(2, 'Nom trop court'),
    email: z.string().email('Email invalide'),
    phoneNumber: z.string().regex(/^\+?[0-9]{9,15}$/, 'Numéro invalide'),
    role: z.enum(['manager', 'manager_viewer']),
})

type ManagerForm = z.infer<typeof managerSchema>

interface Props {
    open: boolean
    onClose: () => void
}

/* ----------------------------
 * Composant principal
 * ---------------------------- */
export default function CreateManagerModal({ open, onClose }: Props) {
    const queryClient = useQueryClient()

    const form = useForm<ManagerForm>({
        resolver: zodResolver(managerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            role: 'manager',
        },
    })

    const mutation = useMutation({
        mutationFn: async (data: ManagerForm) => {
            const res = await api.post('/users', data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Manager créé avec succès')
            queryClient.invalidateQueries({ queryKey: ['managers'] })
            onClose()
        },
    })

    const onSubmit = (data: ManagerForm) => mutation.mutate(data)

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Ajouter un Manager</DialogTitle>
                </DialogHeader>

                <motion.form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex gap-3">
                        <Input
                            {...form.register('firstName')}
                            placeholder="Prénom"
                            className="w-1/2"
                        />
                        <Input {...form.register('lastName')} placeholder="Nom" className="w-1/2" />
                    </div>

                    <Input {...form.register('email')} placeholder="Email" type="email" />
                    <Input {...form.register('phoneNumber')} placeholder="Téléphone (+243...)" />

                    <Select
                        onValueChange={(v) => form.setValue('role', v as any)}
                        defaultValue={form.getValues('role')}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choisir un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="manager_viewer">Manager (Vue seule)</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        type="submit"
                        className="w-full bg-primary text-white"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Création...' : 'Créer le compte'}
                    </Button>
                </motion.form>
            </DialogContent>
        </Dialog>
    )
}
