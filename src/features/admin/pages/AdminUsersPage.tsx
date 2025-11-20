'use client'

import { useState } from 'react'
import {
    useManagers,
    useBlockManager,
    useUnblockManager,
    useDeleteManager,
} from '../hooks/useManagers'
import { UserTableHeader } from '@/features/admin/components/UserTableHeader'
import CreateManagerModal from '@/features/admin/components/CreateManagerModal'
import { UserListResponsive } from '@/features/admin/components/UserListResponsive'
import { Loader2, AlertTriangle } from 'lucide-react'
import type { User } from '@/types/user'
import EditManagerModal from '@/features/admin/components/EditManagerModal'
import { ConfirmActionModal } from '@/components/ui/ConfirmActionModal'
import NumberedPagination from '@/components/ui/NumberedPagination'

export default function AdminUsersPage() {
	const [search, setSearch] = useState('')
	const [page, setPage] = useState(1)
	const limit = 10
	const { data, isLoading, isError } = useManagers(search, page, limit)
	const users = data?.items ?? []
	const meta = data?.meta

    const blockMutation = useBlockManager()
    const unblockMutation = useUnblockManager()
    const deleteMutation = useDeleteManager()
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

	/** Modal de confirmation pour les actions sensibles */
	const [confirmState, setConfirmState] = useState<{
		open: boolean
		action: 'block' | 'unblock' | 'delete'
		id: string | null
	}>({
		open: false,
		action: 'block',
		id: null,
	})

	const openConfirm = (action: 'block' | 'unblock' | 'delete', id: string) =>
		setConfirmState({ open: true, action, id })

	const handleConfirm = () => {
		if (!confirmState.id) return
		if (confirmState.action === 'block') blockMutation.mutate(confirmState.id)
		if (confirmState.action === 'unblock') unblockMutation.mutate(confirmState.id)
		if (confirmState.action === 'delete') deleteMutation.mutate(confirmState.id)
		setConfirmState((s) => ({ ...s, open: false, id: null }))
	}

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center mt-16 text-text-secondary space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm">Chargement des utilisateurs...</p>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center mt-16 text-danger space-y-2">
                <AlertTriangle className="w-8 h-8" />
                <p>Erreur de chargement des utilisateurs.</p>
            </div>
        )
    }

	return (
		<section className="space-y-6 border border-border bg-surface p-4 md:p-6">
			<UserTableHeader onAdd={() => setShowAddModal(true)} onSearch={setSearch} />

            <UserListResponsive
                users={users}
				onBlock={(id) => openConfirm('block', id)}
				onUnblock={(id) => openConfirm('unblock', id)}
				onDelete={(id) => openConfirm('delete', id)}
                onEdit={(user) => {
                    setSelectedUser(user)
                    setShowEditModal(true)
                }}
            />

			{meta && (
				<div className="py-3 flex justify-center">
					<NumberedPagination
						currentPage={meta.currentPage ?? page}
						totalPages={meta.lastPage ?? 1}
						onPageChange={setPage}
					/>
				</div>
			)}

            <CreateManagerModal open={showAddModal} onClose={() => setShowAddModal(false)} />
            <EditManagerModal
                open={showEditModal}
                user={selectedUser}
                onClose={() => setShowEditModal(false)}
            />

			<ConfirmActionModal
				open={confirmState.open}
				onCancel={() => setConfirmState((s) => ({ ...s, open: false }))}
				onConfirm={handleConfirm}
				title={
					confirmState.action === 'block'
						? "Bloquer l'utilisateur ?"
						: confirmState.action === 'unblock'
						? "Débloquer l'utilisateur ?"
						: 'Supprimer cet utilisateur ?'
				}
				description={
					confirmState.action === 'block'
						? "Cet utilisateur ne pourra plus accéder à son compte."
						: confirmState.action === 'unblock'
						? "L'utilisateur pourra se reconnecter normalement."
						: 'Cette action est irréversible.'
				}
				confirmLabel={
					confirmState.action === 'block'
						? 'Confirmer le blocage'
						: confirmState.action === 'unblock'
						? 'Confirmer'
						: 'Supprimer définitivement'
				}
				danger={confirmState.action === 'block' || confirmState.action === 'delete'}
			/>
        </section>
    )
}
