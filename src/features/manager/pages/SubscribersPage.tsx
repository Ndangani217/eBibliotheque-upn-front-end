'use client'

import { useState } from 'react'
import { Loader2, AlertTriangle } from 'lucide-react'
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
import { ConfirmActionModal } from '@/components/ui/ConfirmActionModal'
import NumberedPagination from '@/components/ui/NumberedPagination'

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

    const [confirmState, setConfirmState] = useState<{ open: boolean; type: 'block' | 'unblock' | 'reset'; id: string | null }>({
        open: false,
        type: 'block',
        id: null,
    })

    const openConfirm = (type: 'block' | 'unblock' | 'reset', id: string) =>
        setConfirmState({ open: true, type, id })

    const handleBlock = (id: string) => openConfirm('block', id)
    const handleUnblock = (id: string) => openConfirm('unblock', id)
    const handleSendReset = (id: string) => openConfirm('reset', id)

    const handleConfirm = () => {
        if (!confirmState.id) return
        if (confirmState.type === 'block') {
            blockMutation.mutate(confirmState.id)
        } else if (confirmState.type === 'unblock') {
            unblockMutation.mutate(confirmState.id)
        } else if (confirmState.type === 'reset') {
            sendPasswordResetMutation.mutate(confirmState.id)
        }
        setConfirmState({ ...confirmState, open: false, id: null })
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
            <div className="border border-border bg-surface p-4 md:p-6 space-y-4">
                <SubscriberTableHeader onSearch={setSearch} />

                <SubscriberListResponsive
                    subscribers={subscribers}
                    onBlock={handleBlock}
                    onUnblock={handleUnblock}
                    onEditEmail={handleEditEmail}
                    onSendPasswordReset={handleSendReset}
                />

                {meta && meta.lastPage >= 1 && (
                    <div className="py-3 flex justify-center">
                        <NumberedPagination
                            currentPage={meta.currentPage ?? page}
                            totalPages={meta.lastPage}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>

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

            <ConfirmActionModal
                open={confirmState.open}
                onCancel={() => setConfirmState({ ...confirmState, open: false })}
                onConfirm={handleConfirm}
                title={
                    confirmState.type === 'block'
                        ? "Bloquer l'utilisateur ?"
                        : confirmState.type === 'unblock'
                        ? "Débloquer l'utilisateur ?"
                        : "Envoyer le lien de réinitialisation ?"
                }
                description={
                    confirmState.type === 'block'
                        ? "Cet abonné ne pourra plus accéder à son compte."
                        : confirmState.type === 'unblock'
                        ? "L'abonné pourra se reconnecter normalement."
                        : "Un e-mail sécurisé sera envoyé à l’abonné pour réinitialiser son mot de passe."
                }
                confirmLabel={
                    confirmState.type === 'block'
                        ? 'Confirmer le blocage'
                        : confirmState.type === 'unblock'
                        ? 'Confirmer'
                        : 'Envoyer le lien'
                }
                danger={confirmState.type === 'block'}
                confirmLoading={
                    confirmState.type === 'block'
                        ? blockMutation.isPending
                        : confirmState.type === 'unblock'
                        ? unblockMutation.isPending
                        : sendPasswordResetMutation.isPending
                }
            />
        </section>
    )
}

