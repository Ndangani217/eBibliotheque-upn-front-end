'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, KeyRound, Ban, CheckCircle, Phone } from 'lucide-react'
import type { User } from '@/types/user'
import { getCategoryLabel } from '@/utils/labels'

interface Props {
    subscriber: User
    onBlock: (id: string) => void
    onUnblock: (id: string) => void
    onEditEmail: (subscriber: User) => void
    onSendPasswordReset: (id: string) => void
}

export function SubscriberCard({
    subscriber,
    onBlock,
    onUnblock,
    onEditEmail,
    onSendPasswordReset,
}: Props) {
    return (
        <div className="bg-surface border border-border shadow-card rounded-[9px] p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base text-text">
                    {subscriber.firstName} {subscriber.lastName}
                </h3>
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
            </div>

            <div className="text-sm text-text-secondary space-y-2">
                <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {subscriber.email}
                </p>
                {subscriber.phoneNumber && (
                    <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {subscriber.phoneNumber}
                    </p>
                )}
                {subscriber.category && (
                    <p className="text-xs">
                        <Badge
                            className={`rounded-[9px] ${
                                subscriber.category === 'student'
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-secondary/10 text-secondary'
                            }`}
                        >
                            {getCategoryLabel(subscriber.category)}
                        </Badge>
                    </p>
                )}
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditEmail(subscriber)}
                    className="text-primary hover:text-primary-dark hover:bg-primary/10 rounded-[9px] flex-1"
                >
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSendPasswordReset(subscriber.id)}
                    className="text-secondary hover:text-secondary-dark hover:bg-secondary/10 rounded-[9px] flex-1"
                >
                    <KeyRound className="w-4 h-4 mr-1" />
                    Réinit.
                </Button>
                {subscriber.isBlocked ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUnblock(subscriber.id)}
                        className="text-success hover:text-success-dark hover:bg-success/10 rounded-[9px] flex-1"
                    >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Débloquer
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onBlock(subscriber.id)}
                        className="text-danger hover:text-danger-dark hover:bg-danger/10 rounded-[9px] flex-1"
                    >
                        <Ban className="w-4 h-4 mr-1" />
                        Bloquer
                    </Button>
                )}
            </div>
        </div>
    )
}

