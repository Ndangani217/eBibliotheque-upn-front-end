'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { CardStatus } from '@/types/card'
import { CardList } from './CardList'
import { useManagerCards, useSuspendCard } from '@/features/manager/hooks/useManagerCards'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Search, CreditCard } from 'lucide-react'

/**
 * CardTabs — Interface de gestion des cartes
 * Affiche les onglets : actives / inactives
 */
export function CardTabs() {
    const [tab, setTab] = useState<CardStatus>(CardStatus.ACTIVE)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)

    //Appels API distincts pour chaque statut
    const activeCards = useManagerCards(CardStatus.ACTIVE, 1, '')
    const inactiveCards = useManagerCards(CardStatus.INACTIVE, 1, '')

    // Appel principal selon l’onglet actif
    const { data, isLoading, isError } = useManagerCards(tab, page, search)
    const suspendMutation = useSuspendCard()

    // Comptages indépendants
    const activeCount = activeCards.data?.meta?.total ?? 0
    const inactiveCount = inactiveCards.data?.meta?.total ?? 0

    return (
        <div className="w-full space-y-4">
            {/* ====== En-tête + Recherche ====== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold text-primary">Gestion des cartes</h2>
                </div>

                {/* Barre de recherche */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Rechercher une carte ou un abonné..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* ====== Onglets ====== */}
            <Tabs value={tab} onValueChange={(v) => setTab(v as CardStatus)} className="w-full">
                <TabsList className="grid grid-cols-2 w-full mb-4 bg-muted/40 rounded-[9px]">
                    {/* ---- Onglet Actives ---- */}
                    <TabsTrigger
                        value={CardStatus.ACTIVE}
                        className="relative data-[state=active]:bg-primary/10 data-[state=active]:text-primary capitalize"
                    >
                        <span className="flex items-center gap-2">
                            Actives
                            <Badge variant="secondary" className="text-xs">
                                {activeCount}
                            </Badge>
                        </span>
                        {tab === CardStatus.ACTIVE && (
                            <motion.div
                                layoutId="tab-indicator"
                                className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"
                            />
                        )}
                    </TabsTrigger>

                    {/* ---- Onglet Inactives ---- */}
                    <TabsTrigger
                        value={CardStatus.INACTIVE}
                        className="relative data-[state=active]:bg-primary/10 data-[state=active]:text-primary capitalize"
                    >
                        <span className="flex items-center gap-2">
                            Inactives
                            <Badge variant="secondary" className="text-xs">
                                {inactiveCount}
                            </Badge>
                        </span>
                        {tab === CardStatus.INACTIVE && (
                            <motion.div
                                layoutId="tab-indicator"
                                className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"
                            />
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* ---- Contenu des onglets ---- */}
                {[CardStatus.ACTIVE, CardStatus.INACTIVE].map((status) => (
                    <TabsContent key={status} value={status}>
                        {tab === status && (
                            <CardList
                                cards={data?.items ?? []}
                                meta={{
                                    total: data?.meta?.total ?? 0,
                                    page: (data?.meta?.page as number) ?? 1,
                                    lastPage: (data?.meta?.lastPage as number) ?? 1,
                                }}
                                loading={isLoading}
                                error={isError}
                                onSuspend={(id) => suspendMutation.mutate(id)}
                                suspending={suspendMutation.isPending}
                                onPageChange={setPage}
                            />
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
