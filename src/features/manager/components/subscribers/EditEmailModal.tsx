'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Mail } from 'lucide-react'
import type { User } from '@/types/user'

const schema = z.object({
    email: z.string().email('Email invalide'),
})

type FormData = z.infer<typeof schema>

interface Props {
    open: boolean
    subscriber: User | null
    onClose: () => void
    onSave: (id: string, email: string) => Promise<void>
}

export function EditEmailModal({ open, subscriber, onClose, onSave }: Props) {
    const [isSaving, setIsSaving] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: subscriber?.email || '',
        },
    })

    // Réinitialiser le formulaire quand le subscriber change
    useEffect(() => {
        if (subscriber) {
            reset({ email: subscriber.email })
        }
    }, [subscriber, reset])

    const onSubmit = async (data: FormData) => {
        if (!subscriber) return

        setIsSaving(true)
        try {
            await onSave(subscriber.id, data.email)
            reset()
            onClose()
        } catch (error) {
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="rounded-[9px]">
                <DialogHeader>
                    <DialogTitle className="text-text">Modifier l&apos;email</DialogTitle>
                    <DialogDescription className="text-text-secondary">
                        Modifiez l&apos;adresse e-mail de {subscriber?.firstName}{' '}
                        {subscriber?.lastName}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-text">
                            Nouvel email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="exemple@upn.cd"
                            {...register('email')}
                            className="border-border bg-surface text-text rounded-[9px]"
                        />
                        {errors.email && (
                            <p className="text-sm text-danger">{errors.email.message}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="rounded-[9px]"
                            disabled={isSaving}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-primary hover:bg-primary-dark text-surface rounded-[9px] flex items-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                <>
                                    <Mail className="w-4 h-4" />
                                    Enregistrer
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

