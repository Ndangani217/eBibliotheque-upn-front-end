'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, KeyRound, Ban, CheckCircle, UserX } from 'lucide-react'
import type { User } from '@/types/user'

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
            <div className="flex flex-col items-center justify-center py-12 text-text-secondary bg-surface rounded-[9px] border border-border shadow-card">
                <UserX className="w-12 h-12 text-text-secondary/50 mb-3" />
                <p className="text-sm font-medium mb-1">Aucun abonné trouvé</p>
                <p className="text-xs text-text-secondary/70 text-center px-4">
                    Aucun utilisateur n&apos;a encore créé de compte.
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto rounded-[9px] border border-border bg-surface shadow-card">
            <table className="w-full text-sm">
                <thead className="bg-background border-b border-border text-left">
                    <tr>
                        <th className="px-4 py-3 text-text font-semibold">Nom</th>
                        <th className="px-4 py-3 text-text font-semibold">Email</th>
                        <th className="px-4 py-3 text-text font-semibold">Téléphone</th>
                        <th className="px-4 py-3 text-text font-semibold">Catégorie</th>
                        <th className="px-4 py-3 text-text font-semibold">Statut</th>
                        <th className="px-4 py-3 text-right text-text font-semibold">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {subscribers.map((subscriber) => (
                        <tr
                            key={subscriber.id}
                            className="border-b border-border hover:bg-primary/5 transition-colors"
                        >
                            <td className="px-4 py-3 text-text">
                                {subscriber.firstName} {subscriber.lastName}
                            </td>
                            <td className="px-4 py-3 text-text-secondary">{subscriber.email}</td>
                            <td className="px-4 py-3 text-text-secondary">
                                {subscriber.phoneNumber || '-'}
                            </td>
                            <td className="px-4 py-3">
                                {subscriber.category ? (
                                    <Badge
                                        className={`rounded-[9px] ${
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
                            </td>
                            <td className="px-4 py-3">
                                <Badge
                                    className={`rounded-[9px] ${
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
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEditEmail(subscriber)}
                                        className="text-primary hover:text-primary-dark hover:bg-primary/10 rounded-[9px]"
                                        title="Modifier l'email"
                                    >
                                        <Mail className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onSendPasswordReset(subscriber.id)}
                                        className="text-secondary hover:text-secondary-dark hover:bg-secondary/10 rounded-[9px]"
                                        title="Envoyer lien de réinitialisation"
                                    >
                                        <KeyRound className="w-4 h-4" />
                                    </Button>
                                    {subscriber.isBlocked ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onUnblock(subscriber.id)}
                                            className="text-success hover:text-success-dark hover:bg-success/10 rounded-[9px]"
                                            title="Débloquer"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onBlock(subscriber.id)}
                                            className="text-danger hover:text-danger-dark hover:bg-danger/10 rounded-[9px]"
                                            title="Bloquer"
                                        >
                                            <Ban className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

