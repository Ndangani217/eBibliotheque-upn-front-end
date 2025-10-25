'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { theme } from '@/constants/theme'

interface Props {
    onAdd: () => void
    onSearch: (value: string) => void // ✅ ajouté ici
}

export function UserTableHeader({ onAdd, onSearch }: Props) {
    const [value, setValue] = useState('')

    // 🔍 Déclenche la recherche avec un petit délai
    useEffect(() => {
        const delay = setTimeout(() => {
            onSearch(value.trim())
        }, 400)
        return () => clearTimeout(delay)
    }, [value, onSearch])

    return (
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Titre */}
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-primary">
                    Gestion des utilisateurs
                </h1>
                <p className="text-sm text-text-secondary">
                    Rechercher ou gérer les comptes <strong>Manager</strong> et{' '}
                    <strong>Manager (Vue seule)</strong>.
                </p>
            </div>

            {/* Zone d’action */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Champ de recherche */}
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Rechercher un utilisateur..."
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="pl-8"
                    />
                </div>

                {/* Bouton Ajouter */}
                <Button
                    className="flex items-center gap-2"
                    style={{ backgroundColor: theme.colors.primary, color: theme.colors.surface }}
                    onClick={onAdd}
                >
                    <Plus className="w-4 h-4" /> Ajouter
                </Button>
            </div>
        </header>
    )
}
