'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, KeyRound, Ban, CheckCircle, UserX } from 'lucide-react'
import type { User } from '@/types/user'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Props {
    subscribers: User[]
    onBlock: (id: string) => void
    onUnblock: (id: string) => void
    onEditEmail: (subscriber: User) => void
    onSendPasswordReset: (id: string) => void
}

export function SubscriberTable({
    subscribers,
    onBlock,
    onUnblock,
    onEditEmail,
    onSendPasswordReset,
}: Props) {
    // Afficher l'état vide si aucun abonné
    if (subscribers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-text-secondary bg-surface border border-border">
                <UserX className="w-12 h-12 text-text-secondary/50 mb-3" />
                <p className="text-sm font-medium mb-1">Aucun abonné trouvé</p>
                <p className="text-xs text-text-secondary/70 text-center px-4">
                    Aucun utilisateur n&apos;a encore créé de compte.
                </p>
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                        <TableCell className="text-text">
                            {subscriber.firstName} {subscriber.lastName}
                        </TableCell>
                        <TableCell className="text-text-secondary">{subscriber.email}</TableCell>
                        <TableCell className="text-text-secondary">
                            {subscriber.phoneNumber || '-'}
                        </TableCell>
                        <TableCell>
                            {subscriber.category ? (
                                <Badge
                                    className={`${
                                        subscriber.category === 'student'
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-secondary/10 text-secondary'
                                    }`}
                                >
                                    {subscriber.category === 'student' ? 'Étudiant' : 'Chercheur'}
                                </Badge>
                            ) : (
                                <span className="text-text-secondary">-</span>
                            )}
                        </TableCell>
                        <TableCell>
                            <Badge
                                className={`${
                                    subscriber.isBlocked
                                        ? 'bg-danger/10 text-danger'
                                        : 'bg-success/10 text-success'
                                }`}
                            >
                                {subscriber.isBlocked ? (
                                    <>
                                        <Ban className="w-3 h-3 mr-1 inline" />
                                        Bloqué
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-3 h-3 mr-1 inline" />
                                        Actif
                                    </>
                                )}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEditEmail(subscriber)}
                                    className="text-primary hover:text-primary-dark hover:bg-primary/10"
                                    title="Modifier l'email"
                                >
                                    <Mail className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onSendPasswordReset(subscriber.id)}
                                    className="text-secondary hover:text-secondary-dark hover:bg-secondary/10"
                                    title="Envoyer lien de réinitialisation"
                                >
                                    <KeyRound className="w-4 h-4" />
                                </Button>
                                {subscriber.isBlocked ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onUnblock(subscriber.id)}
                                        className="text-success hover:text-success-dark hover:bg-success/10"
                                        title="Débloquer"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onBlock(subscriber.id)}
                                        className="text-danger hover:text-danger-dark hover:bg-danger/10"
                                        title="Bloquer"
                                    >
                                        <Ban className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

