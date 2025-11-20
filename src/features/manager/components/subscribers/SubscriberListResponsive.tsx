'use client'

import { SubscriberTable } from './SubscriberTable'
import { SubscriberCard } from './SubscriberCard'
import { UserX } from 'lucide-react'
import type { User } from '@/types/user'

interface Props {
    subscribers: User[]
    onBlock: (id: string) => void
    onUnblock: (id: string) => void
    onEditEmail: (subscriber: User) => void
    onSendPasswordReset: (id: string) => void
}

export function SubscriberListResponsive({
    subscribers,
    onBlock,
    onUnblock,
    onEditEmail,
    onSendPasswordReset,
}: Props) {
    return (
        <div>
            {/* Vue Desktop : tableau visible à partir de 768px */}
            <div className="hidden md:block">
                <SubscriberTable
                    subscribers={subscribers}
                    onBlock={onBlock}
                    onUnblock={onUnblock}
                    onEditEmail={onEditEmail}
                    onSendPasswordReset={onSendPasswordReset}
                />
            </div>

            {/* Vue Mobile : cartes visibles en dessous de 768px */}
            <div className="block md:hidden space-y-3">
                {subscribers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-text-secondary bg-surface rounded-[9px] border border-border">
                        <UserX className="w-12 h-12 text-text-secondary/50 mb-3" />
                        <p className="text-sm font-medium mb-1">Aucun abonné trouvé</p>
                        <p className="text-xs text-text-secondary/70 text-center px-4">
                            Aucun utilisateur n&apos;a encore créé de compte.
                        </p>
                    </div>
                ) : (
                    subscribers.map((subscriber) => (
                        <SubscriberCard
                            key={subscriber.id}
                            subscriber={subscriber}
                            onBlock={onBlock}
                            onUnblock={onUnblock}
                            onEditEmail={onEditEmail}
                            onSendPasswordReset={onSendPasswordReset}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

