'use client'

import { useState } from 'react'
import { Loader2, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import {
    useSubscribers,
    useBlockSubscriber,
    useUnblockSubscriber,
    useUpdateSubscriberEmail,
    useSendPasswordResetLink,
} from '../hooks/useSubscribers'
import { SubscriberTableHeader } from '../components/subscribers/SubscriberTableHeader'
import { SubscriberListResponsive } from '../components/subscribers/SubscriberListResponsive'
import { EditEmailModal } from '../components/subscribers/EditEmailModal'
import { Button } from '@/components/ui/button'
import type { User } from '@/types/user'

export default function SubscribersPage() {
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const limit = 10
    const [selectedSubscriber, setSelectedSubscriber] = useState<User | null>(null)
    const [isEditEmailModalOpen, setIsEditEmailModalOpen] = useState(false)

    const { data, isLoading, isError } = useSubscribers({ page, limit, search })
    const blockMutation = useBlockSubscriber()
    const unblockMutation = useUnblockSubscriber()
    const updateEmailMutation = useUpdateSubscriberEmail()
    const sendPasswordResetMutation = useSendPasswordResetLink()

    const subscribers = data?.data || []
    const meta = data?.meta

    const handleEditEmail = (subscriber: User) => {
        setSelectedSubscriber(subscriber)
        setIsEditEmailModalOpen(true)
    }

    const handleSaveEmail = async (id: string, email: string) => {
        await updateEmailMutation.mutateAsync({ id, email })
    }

    const handleBlock = (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir bloquer cet abonné ?')) {
            blockMutation.mutate(id)
        }
    }

    const handleUnblock = (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir débloquer cet abonné ?')) {
            unblockMutation.mutate(id)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center mt-16 text-text-secondary space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm">Chargement des abonnés...</p>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center mt-16 text-danger space-y-2">
                <AlertTriangle className="w-8 h-8" />
                <p>Erreur de chargement des abonnés.</p>
            </div>
        )
    }

    return (
        <section className="space-y-6">
            <SubscriberTableHeader onSearch={setSearch} />

            <SubscriberListResponsive
                subscribers={subscribers}
                onBlock={handleBlock}
                onUnblock={handleUnblock}
                onEditEmail={handleEditEmail}
                onSendPasswordReset={(id) => sendPasswordResetMutation.mutate(id)}
            />

            {/* Pagination */}
            {meta && meta.total > limit && (
                <div className="flex items-center justify-between border-t border-border pt-4">
                    <p className="text-sm text-text-secondary">
                        Affichage de {(page - 1) * limit + 1} à{' '}
                        {Math.min(page * limit, meta.total)} sur {meta.total} abonnés
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="rounded-[9px] flex items-center gap-1"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Précédent
                        </Button>
                        <span className="text-sm text-text-secondary px-2">
                            Page {page} sur {meta.lastPage}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
                            disabled={page === meta.lastPage}
                            className="rounded-[9px] flex items-center gap-1"
                        >
                            Suivant
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Modal de modification d'email */}
            <EditEmailModal
                open={isEditEmailModalOpen}
                subscriber={selectedSubscriber}
                onClose={() => {
                    setIsEditEmailModalOpen(false)
                    setSelectedSubscriber(null)
                }}
                onSave={handleSaveEmail}
            />
        </section>
    )
}

