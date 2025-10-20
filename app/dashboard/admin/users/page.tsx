'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { theme } from '@/constants/theme'
import { Plus, UserMinus, UserCheck, Trash2, WifiOff, Wifi, Clock } from 'lucide-react'

// Exemple de données simulées (à remplacer par ton fetch API)
const mockUsers = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@upn.cd',
        role: 'manager',
        isBlocked: false,
        isConnected: true,
        lastSeen: '2 min ago',
    },
    {
        id: 2,
        firstName: 'Sarah',
        lastName: 'Mwamba',
        email: 'sarah.mwamba@upn.cd',
        role: 'manager_viewer',
        isBlocked: true,
        isConnected: false,
        lastSeen: '1h 23m ago',
    },
]

export default function AdminUsersPage() {
    const [users, setUsers] = useState(mockUsers)

    /** Gestion des actions */
    const handleToggleBlock = (id: number) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isBlocked: !u.isBlocked } : u)))
    }

    const handleDelete = (id: number) => {
        setUsers((prev) => prev.filter((u) => u.id !== id))
    }

    /** Design principal */
    return (
        <section className="space-y-6">
            {/* ✅ Titre */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-primary">
                        Users Management
                    </h1>
                    <p className="text-sm text-text-secondary">
                        Manage managers and viewer accounts
                    </p>
                </div>

                <Button
                    className="flex items-center gap-2"
                    style={{
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.surface,
                    }}
                >
                    <Plus className="w-4 h-4" /> Add User
                </Button>
            </header>

            {/* ✅ Tableau des utilisateurs */}
            <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-card">
                <table className="w-full text-sm">
                    <thead className="bg-background border-b border-border text-left">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Connection</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b border-border hover:bg-background/60 transition-colors"
                            >
                                <td className="px-4 py-3 font-medium">
                                    {user.firstName} {user.lastName}
                                </td>
                                <td className="px-4 py-3">{user.email}</td>
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
                                        {user.isBlocked ? 'Blocked' : 'Active'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 flex items-center gap-2">
                                    {user.isConnected ? (
                                        <>
                                            <Wifi className="w-4 h-4 text-success" /> Connected
                                        </>
                                    ) : (
                                        <>
                                            <WifiOff className="w-4 h-4 text-danger" />{' '}
                                            {user.lastSeen}
                                        </>
                                    )}
                                </td>

                                {/* ✅ Actions */}
                                <td className="px-4 py-3 text-right flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="hover:text-danger"
                                        onClick={() => handleDelete(user.id)}
                                        title="Delete user"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className={
                                            user.isBlocked
                                                ? 'text-success hover:text-success/80'
                                                : 'text-danger hover:text-danger/80'
                                        }
                                        onClick={() => handleToggleBlock(user.id)}
                                        title={user.isBlocked ? 'Unblock user' : 'Block user'}
                                    >
                                        {user.isBlocked ? (
                                            <UserCheck className="w-4 h-4" />
                                        ) : (
                                            <UserMinus className="w-4 h-4" />
                                        )}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
