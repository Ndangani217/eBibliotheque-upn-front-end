'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/ui/confirmDialog'
import { theme } from '@/constants/theme'
import { Trash2, UserMinus, UserCheck, Mail, Shield, Phone } from 'lucide-react'

interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    role: string
    isBlocked: boolean
}

interface Props {
    users: User[]
    onBlock: (id: string) => void
    onUnblock: (id: string) => void
    onDelete: (id: string) => void
}

export function UserCards({ users, onBlock, onUnblock, onDelete }: Props) {
    const [confirm, setConfirm] = useState<{
        open: boolean
        action?: 'delete' | 'block' | 'unblock'
        userId?: string
    }>({ open: false })

    const openDialog = (action: 'delete' | 'block' | 'unblock', userId: string) =>
        setConfirm({ open: true, action, userId })

    const closeDialog = () => setConfirm({ open: false })

    const handleConfirm = () => {
        if (!confirm.userId) return
        if (confirm.action === 'delete') onDelete(confirm.userId)
        if (confirm.action === 'block') onBlock(confirm.userId)
        if (confirm.action === 'unblock') onUnblock(confirm.userId)
        closeDialog()
    }

    if (users.length === 0) {
        return (
            <p className="text-center py-10 text-text-secondary bg-surface rounded-[9px] border border-border">
                Aucun utilisateur trouvé.
            </p>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="bg-surface border border-border shadow-card rounded-[9px] p-4 flex flex-col justify-between hover:shadow-lg hover:border-primary/50 transition-all duration-200"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-base sm:text-lg text-primary">
                                {user.firstName} {user.lastName}
                            </h3>
                            <Badge
                                style={{
                                    backgroundColor: user.isBlocked
                                        ? theme.colors.danger
                                        : theme.colors.success,
                                    color: 'white',
                                }}
                            >
                                {user.isBlocked ? 'Bloqué' : 'Actif'}
                            </Badge>
                        </div>

                        <div className="text-sm text-text-secondary space-y-1 mb-4">
                            <p className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-text-secondary" />
                                {user.email}
                            </p>
                            <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-text-secondary" />
                                {user.phoneNumber || '—'}
                            </p>
                            <p className="flex items-center gap-2 capitalize">
                                <Shield className="w-4 h-4 text-text-secondary" />
                                {user.role.replace('_', ' ')}
                            </p>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="hover:text-danger border-border"
                                onClick={() => openDialog('delete', user.id)}
                                title="Supprimer"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>

                            {user.isBlocked ? (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="text-success hover:text-success/80 border-border"
                                    onClick={() => openDialog('unblock', user.id)}
                                    title="Débloquer"
                                >
                                    <UserCheck className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="text-danger hover:text-danger/80 border-border"
                                    onClick={() => openDialog('block', user.id)}
                                    title="Bloquer"
                                >
                                    <UserMinus className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ Modal de confirmation */}
            <ConfirmDialog
                open={confirm.open}
                title={
                    confirm.action === 'delete'
                        ? 'Supprimer cet utilisateur ?'
                        : confirm.action === 'block'
                        ? 'Bloquer cet utilisateur ?'
                        : 'Débloquer cet utilisateur ?'
                }
                description={
                    confirm.action === 'delete'
                        ? 'Cette action est irréversible. Le compte sera définitivement supprimé.'
                        : confirm.action === 'block'
                        ? 'L’utilisateur ne pourra plus se connecter tant qu’il est bloqué.'
                        : 'L’utilisateur pourra à nouveau accéder à la plateforme.'
                }
                confirmLabel={
                    confirm.action === 'delete'
                        ? 'Supprimer'
                        : confirm.action === 'block'
                        ? 'Bloquer'
                        : 'Débloquer'
                }
                danger={confirm.action === 'delete' || confirm.action === 'block'}
                onCancel={closeDialog}
                onConfirm={handleConfirm}
            />
        </>
    )
}
