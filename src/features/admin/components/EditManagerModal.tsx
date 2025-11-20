'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Save, UserCog } from 'lucide-react'
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/services/api'
import { toast } from 'sonner'
import type { User } from '@/types/user'

const schema = z.object({
	firstName: z.string().min(2, 'Prénom trop court'),
	lastName: z.string().min(2, 'Nom trop court'),
	email: z.string().email('Email invalide'),
	phoneNumber: z.string().regex(/^\+?[0-9]{9,15}$/, 'Numéro invalide').optional().or(z.literal('')),
	role: z.enum(['manager', 'manager_viewer']),
})

type FormValues = z.infer<typeof schema>

interface Props {
	open: boolean
	user: User | null
	onClose: () => void
}

export default function EditManagerModal({ open, user, onClose }: Props) {
	const queryClient = useQueryClient()

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phoneNumber: '',
			role: 'manager',
		},
	})

	useEffect(() => {
		if (user) {
			form.reset({
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				phoneNumber: user.phoneNumber ?? '',
				role: user.role as 'manager' | 'manager_viewer',
			})
		}
	}, [user, form])

	const updateMutation = useMutation({
		mutationFn: async (values: FormValues) => {
			if (!user) return
			const payload = {
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				phoneNumber: values.phoneNumber || undefined,
				role: values.role,
			}
			await usersApi.update(user.id, payload)
		},
		onSuccess: () => {
			toast.success('Informations mises à jour')
			queryClient.invalidateQueries({ queryKey: ['managers'] })
			onClose()
		},
	})

	const onSubmit = (values: FormValues) => updateMutation.mutate(values)

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<UserCog className="w-5 h-5 text-primary" />
						Modifier le Manager
					</DialogTitle>
				</DialogHeader>

				<motion.form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4 mt-2"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
				>
					<div className="flex gap-3">
						<Input {...form.register('firstName')} placeholder="Prénom" className="w-1/2" />
						<Input {...form.register('lastName')} placeholder="Nom" className="w-1/2" />
					</div>

					<Input {...form.register('email')} placeholder="Email" type="email" />
					<Input {...form.register('phoneNumber')} placeholder="Téléphone (+243...)" />

					<Select onValueChange={(v) => form.setValue('role', v as 'manager' | 'manager_viewer')} value={form.watch('role')}>
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
						className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-surface font-medium rounded-[9px] py-2 shadow-button transition-all duration-200"
						disabled={updateMutation.isPending}
					>
						{updateMutation.isPending ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								Enregistrement...
							</>
						) : (
							<>
								<Save className="w-4 h-4" />
								Enregistrer
							</>
						)}
					</Button>
				</motion.form>
			</DialogContent>
		</Dialog>
	)
}


