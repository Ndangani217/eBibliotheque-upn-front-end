'use client'

import { UserTable } from './UserTable'
import { UserCards } from './UserCards'
import type { User } from '@/types/user'

interface Props {
    users: User[]
    onBlock: (id: string) => void
    onUnblock: (id: string) => void
    onDelete: (id: string) => void
}

export function UserListResponsive({ users, onBlock, onUnblock, onDelete }: Props) {
    return (
        <div>
            {/* 🖥️ Vue Desktop : tableau visible à partir de 768px */}
            <div className="hidden md:block">
                <UserTable
                    users={users}
                    onBlock={onBlock}
                    onUnblock={onUnblock}
                    onDelete={onDelete}
                />
            </div>

            {/*Vue Mobile : cartes visibles en dessous de 768px */}
            <div className="block md:hidden">
                <UserCards
                    users={users}
                    onBlock={onBlock}
                    onUnblock={onUnblock}
                    onDelete={onDelete}
                />
            </div>
        </div>
    )
}
