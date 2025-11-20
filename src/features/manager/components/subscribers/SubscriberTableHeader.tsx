'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface Props {
    onSearch: (value: string) => void
}

export function SubscriberTableHeader({ onSearch }: Props) {
    const [value, setValue] = useState('')

    // Déclenche la recherche avec un délai
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
                    Gestion des abonnés
                </h1>
                <p className="text-sm text-text-secondary">
                    Rechercher et gérer les comptes des abonnés de la bibliothèque.
                </p>
            </div>

            {/* Zone de recherche */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2 top-2.5 text-text-secondary w-4 h-4" />
                    <Input
                        placeholder="Rechercher par nom..."
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="pl-8 border-border bg-surface text-text rounded-[9px]"
                    />
                </div>
            </div>
        </header>
    )
}

