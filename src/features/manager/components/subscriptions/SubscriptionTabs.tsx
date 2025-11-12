'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import {
    useActiveSubscriptions,
    useExpiredSubscriptions,
    useSuspendedSubscriptions,
    useSuspendSubscription,
    usePrintCardBySubscription,
} from '@/features/manager/hooks/useManagerSubscriptions'
import {
    useExportActiveSubscriptions,
    useExportExpiredSubscriptions,
} from '@/features/manager/hooks/useExcelExports'
import { ExportExcelDialog } from '@/features/manager/components/ExportExcelDialog'
import { SubscriptionList } from './SubscriptionList'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Search, BookOpen } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/confirmDialog'

export function SubscriptionTabs() {
    const [tab, setTab] = useState<'valide' | 'expire' | 'suspendu'>('valide')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const activeSubs = useActiveSubscriptions(page, search)
    const expiredSubs = useExpiredSubscriptions(page, search)
    const suspendedSubs = useSuspendedSubscriptions(page, search)
    const suspendMutation = useSuspendSubscription()
    const printCardMutation = usePrintCardBySubscription()
    const { exportActiveSubscriptions } = useExportActiveSubscriptions()
    const { exportExpiredSubscriptions } = useExportExpiredSubscriptions()

    const handleSuspendClick = (id: string) => {
        setSelectedId(id)
        setConfirmOpen(true)
    }

    const handlePrintCard = (subscriptionId: string) => {
        printCardMutation.mutate(subscriptionId)
    }

    const handleConfirm = () => {
        if (selectedId) suspendMutation.mutate(selectedId)
        setConfirmOpen(false)
    }

    const handleCancel = () => setConfirmOpen(false)

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold text-primary">Gestion des abonnements</h2>
                </div>

                <div className="flex items-center gap-3">
                    {/* Exports Excel selon l'onglet actif */}
                    {tab === 'valide' && (
                        <ExportExcelDialog
                            title="Exporter les abonnements actifs"
                            description="Sélectionnez la période pour exporter les abonnements actifs en Excel"
                            onExport={exportActiveSubscriptions}
                            triggerLabel="Exporter Actifs"
                        />
                    )}
                    {tab === 'expire' && (
                        <ExportExcelDialog
                            title="Exporter les abonnements expirés"
                            description="Sélectionnez la période pour exporter les abonnements expirés en Excel"
                            onExport={exportExpiredSubscriptions}
                            triggerLabel="Exporter Expirés"
                        />
                    )}

                    {/* Recherche */}
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Rechercher un abonné ou une catégorie..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            {/* Onglets */}
            <Tabs value={tab} onValueChange={(v) => setTab(v as 'valide' | 'expire' | 'suspendu')} className="w-full">
                <TabsList className="grid grid-cols-3 w-full mb-4 bg-muted/40 rounded-lg">
                    {[
                        { key: 'valide', label: 'Actifs', count: activeSubs.data?.meta.total },
                        { key: 'expire', label: 'Expirés', count: expiredSubs.data?.meta.total },
                        {
                            key: 'suspendu',
                            label: 'Suspendus',
                            count: suspendedSubs.data?.meta.total,
                        },
                    ].map((t) => (
                        <TabsTrigger
                            key={t.key}
                            value={t.key}
                            className="relative data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                        >
                            <span className="flex items-center gap-2">
                                {t.label}
                                <Badge variant="secondary" className="text-xs">
                                    {t.count ?? 0}
                                </Badge>
                            </span>
                            {tab === t.key && (
                                <motion.div
                                    layoutId="tab-indicator"
                                    className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"
                                />
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="valide">
                    <SubscriptionList
                        subscriptions={activeSubs.data?.items}
                        meta={activeSubs.data?.meta}
                        loading={activeSubs.isLoading}
                        error={activeSubs.isError}
                        onSuspend={handleSuspendClick}
                        suspending={suspendMutation.isPending}
                        onPrintCard={handlePrintCard}
                        onPageChange={setPage}
                    />
                </TabsContent>

                <TabsContent value="expire">
                    <SubscriptionList
                        subscriptions={expiredSubs.data?.items}
                        meta={expiredSubs.data?.meta}
                        loading={expiredSubs.isLoading}
                        error={expiredSubs.isError}
                        onPageChange={setPage}
                    />
                </TabsContent>

                <TabsContent value="suspendu">
                    <SubscriptionList
                        subscriptions={suspendedSubs.data?.items}
                        meta={suspendedSubs.data?.meta}
                        loading={suspendedSubs.isLoading}
                        error={suspendedSubs.isError}
                        onPageChange={setPage}
                    />
                </TabsContent>
            </Tabs>

            {/* Confirmation */}
            <ConfirmDialog
                open={confirmOpen}
                title="Confirmer la suspension"
                description="Cette action suspendra temporairement l'abonnement sélectionné."
                confirmLabel="Oui, suspendre"
                cancelLabel="Annuler"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                danger
            />
        </div>
    )
}
