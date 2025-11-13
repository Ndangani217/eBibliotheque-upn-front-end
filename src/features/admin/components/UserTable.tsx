'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { theme } from '@/constants/theme'
import { Trash2, UserMinus, UserCheck, Phone } from 'lucide-react'

interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string
    role: string
    isBlocked: boolean
}

interface Props {
    users: User[]
    onBlock: (id: string) => void
    onUnblock: (id: string) => void
    onDelete: (id: string) => void
}

export function UserTable({ users, onBlock, onUnblock, onDelete }: Props) {
    return (
        <div className="overflow-x-auto rounded-[9px] border border-border bg-surface shadow-card">
            <table className="w-full text-sm">
                <thead className="bg-background border-b border-border text-left">
                    <tr>
                        <th className="px-4 py-3">Nom</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Téléphone</th>
                        <th className="px-4 py-3">Rôle</th>
                        <th className="px-4 py-3">Statut</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center py-6 text-text-secondary">
                                Aucun utilisateur trouvé.
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b border-border hover:bg-background/60 transition-colors"
                            >
                                <td className="px-4 py-3 font-medium">
                                    {user.firstName} {user.lastName}
                                </td>
                                <td className="px-4 py-3">{user.email}</td>
                                <td className="px-4 py-3 flex items-center gap-1">
                                    <Phone className="w-4 h-4 text-primary" />
                                    {user.phoneNumber || '—'}
                                </td>
                                <td className="px-4 py-3 capitalize">{user.role}</td>
                                <td className="px-4 py-3">
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
                                </td>
                                <td className="px-4 py-3 text-right flex justify-end gap-2">
                                    {/* Supprimer */}
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="hover:text-danger"
                                        onClick={() => onDelete(user.id)}
                                        title="Supprimer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>

                                    {/* Bloquer / Débloquer */}
                                    {user.isBlocked ? (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-success hover:text-success/80"
                                            onClick={() => onUnblock(user.id)}
                                            title="Débloquer"
                                        >
                                            <UserCheck className="w-4 h-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-danger hover:text-danger/80"
                                            onClick={() => onBlock(user.id)}
                                            title="Bloquer"
                                        >
                                            <UserMinus className="w-4 h-4" />
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}
