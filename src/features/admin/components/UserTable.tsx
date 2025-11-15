'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, UserMinus, UserCheck, Phone, Pencil } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { User } from '@/types/user'

interface Props {
    users: User[]
    onBlock: (id: string) => void
    onUnblock: (id: string) => void
    onDelete: (id: string) => void
    onEdit: (user: User) => void
}

export function UserTable({ users, onBlock, onUnblock, onDelete, onEdit }: Props) {
    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-text-secondary">
                                Aucun utilisateur trouvé.
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium text-text">
                                    {user.firstName} {user.lastName}
                                </TableCell>
                                <TableCell className="text-text-secondary">{user.email}</TableCell>
                                <TableCell className="text-text-secondary">
                                    <span className="inline-flex items-center gap-1">
                                        <Phone className="w-4 h-4 text-primary" />
                                        {user.phoneNumber || '—'}
                                    </span>
                                </TableCell>
								<TableCell className="text-text-secondary">
									{({
										admin: 'Administrateur',
										manager: 'Gestionnaire',
										manager_viewer: 'Gestionnaire (vue seule)',
										subscriber: 'Abonné',
									} as Record<string, string>)[user.role] ?? user.role}
								</TableCell>
                                <TableCell>
                                    <Badge
                                        className={`rounded-[9px] ${
                                            user.isBlocked ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
                                        }`}
                                    >
                                        {user.isBlocked ? 'Bloqué' : 'Actif'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {/* Modifier */}
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="rounded-[9px] text-primary hover:text-primary-dark hover:bg-primary/10"
                                            onClick={() => onEdit(user)}
                                            title="Modifier"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        {/* Supprimer */}
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="rounded-[9px] text-danger hover:text-danger/90 hover:bg-danger/10"
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
                                                className="rounded-[9px] text-success hover:text-success/90 hover:bg-success/10"
                                                onClick={() => onUnblock(user.id)}
                                                title="Débloquer"
                                            >
                                                <UserCheck className="w-4 h-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="rounded-[9px] text-danger hover:text-danger/90 hover:bg-danger/10"
                                                onClick={() => onBlock(user.id)}
                                                title="Bloquer"
                                            >
                                                <UserMinus className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
