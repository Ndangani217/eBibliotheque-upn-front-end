'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useManagerPayments, useValidatePayment } from '@/features/manager/hooks/useManagerPayments'
import { useExportPayments } from '@/features/manager/hooks/useExcelExports'
import { ExportExcelDialog } from '@/features/manager/components/ExportExcelDialog'
import { PaymentList } from './PaymentList'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/confirmDialog'
import { Loader2, CreditCard } from 'lucide-react'

export function PaymentTabs() {
    const [tab, setTab] = useState<'en_attente' | 'paye'>('en_attente')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)

    const pendingPayments = useManagerPayments('en_attente', search, page)
    const validatedPayments = useManagerPayments('paye', search, page)
    const validatePayment = useValidatePayment()
    const { exportPayments } = useExportPayments()

    const handleValidateClick = (id: string) => {
        setSelectedPaymentId(id)
        setConfirmOpen(true)
    }

    const handleConfirm = () => {
        if (selectedPaymentId) validatePayment.mutate(selectedPaymentId)
        setConfirmOpen(false)
        setSelectedPaymentId(null)
    }

    const handleCancel = () => {
        setConfirmOpen(false)
        setSelectedPaymentId(null)
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold text-primary">Gestion des paiements</h2>
                </div>

                <div className="flex items-center gap-3">
                    {/* Export Excel */}
                    <ExportExcelDialog
                        title="Exporter les fiches de paiement"
                        description="Sélectionnez la période pour exporter les fiches de paiement en Excel"
                        onExport={exportPayments}
                        triggerLabel="Exporter Excel"
                    />

                    {/* Recherche */}
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Rechercher un abonné ou une référence..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            {/* Onglets */}
            <Tabs
                value={tab}
                onValueChange={(v) => setTab(v as 'en_attente' | 'paye')}
                className="w-full"
            >
                <TabsList className="grid grid-cols-2 w-full mb-4 bg-muted/40 rounded-lg">
                    <TabsTrigger
                        value="en_attente"
                        className="relative data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                    >
                        <span className="flex items-center gap-2">
                            En attente
                            <Badge variant="secondary" className="text-xs">
                                {pendingPayments.data?.meta?.total ?? 0}
                            </Badge>
                        </span>
                        {tab === 'en_attente' && (
                            <motion.div
                                layoutId="tab-indicator"
                                className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"
                            />
                        )}
                    </TabsTrigger>

                    <TabsTrigger
                        value="paye"
                        className="relative data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                    >
                        <span className="flex items-center gap-2">
                            Validés
                            <Badge variant="secondary" className="text-xs">
                                {validatedPayments.data?.meta?.total ?? 0}
                            </Badge>
                        </span>
                        {tab === 'paye' && (
                            <motion.div
                                layoutId="tab-indicator"
                                className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"
                            />
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="en_attente">
                    <PaymentList
                        payments={pendingPayments.data?.items}
                        meta={pendingPayments.data?.meta}
                        loading={pendingPayments.isLoading}
                        error={pendingPayments.isError}
                        onValidate={handleValidateClick}
                        validating={validatePayment.isPending}
                        onPageChange={setPage}
                    />
                </TabsContent>

                <TabsContent value="paye">
                    <PaymentList
                        payments={validatedPayments.data?.items}
                        meta={validatedPayments.data?.meta}
                        loading={validatedPayments.isLoading}
                        error={validatedPayments.isError}
                        onPageChange={setPage}
                    />
                </TabsContent>
            </Tabs>

            {/*Confirmation */}
            <ConfirmDialog
                open={confirmOpen}
                title="Confirmer la validation du paiement"
                description="Cette action activera définitivement la carte associée. Êtes-vous sûr de vouloir continuer ?"
                confirmLabel="Oui, valider"
                cancelLabel="Annuler"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                danger
            />
        </div>
    )
}

