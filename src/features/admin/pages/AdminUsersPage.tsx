'use client'

import { useState } from 'react'
import {
    useManagers,
    useBlockManager,
    useUnblockManager,
    useDeleteManager,
} from '../hooks/useMangers'
import { UserCards } from '@/features/admin/components/UserCards'
import { UserTableHeader } from '@/features/admin/components/UserTableHeader'
import CreateManagerModal from '@/features/admin/components/CreateManagerModal'
import { Loader2, AlertTriangle } from 'lucide-react'
import { UserListResponsive } from '@/features/admin/components/UserListResponsive'

export default function AdminUsersPage() {
    const [search, setSearch] = useState('')
    const { data: users = [], isLoading, isError } = useManagers(search)

    const blockMutation = useBlockManager()
    const unblockMutation = useUnblockManager()
    const deleteMutation = useDeleteManager()
    const [showAddModal, setShowAddModal] = useState(false)

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
        <section className="space-y-6">
            <UserTableHeader onAdd={() => setShowAddModal(true)} onSearch={setSearch} />

            <UserListResponsive
                users={users}
                onBlock={(id) => blockMutation.mutate(id)}
                onUnblock={(id) => unblockMutation.mutate(id)}
                onDelete={(id) => deleteMutation.mutate(id)}
            />

            <CreateManagerModal open={showAddModal} onClose={() => setShowAddModal(false)} />
        </section>
    )
}
