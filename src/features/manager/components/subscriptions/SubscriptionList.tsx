'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, Clock, PauseCircle, Printer } from 'lucide-react'
import { useState } from 'react'
import type { PaginationMeta } from '@/features/manager/hooks/useManagerSubscriptions'
import { usePrintCardBySubscription } from '@/features/manager/hooks/useManagerSubscriptions'
import { Subscription } from '@/types/subscription'
import { SubscriptionCard } from './SubscriptionCard'

interface Props {
    subscriptions?: Subscription[]
    meta?: PaginationMeta
    loading?: boolean
    error?: boolean
    onSuspend?: (id: string) => void
    suspending?: boolean
    onPageChange?: (page: number) => void
    onPrintCard?: (subscriptionId: string) => void
}

export function SubscriptionList({
    subscriptions = [],
    meta,
    loading,
    error,
    onSuspend,
    suspending,
    onPageChange,
    onPrintCard,
}: Props) {
    const printCardMutation = usePrintCardBySubscription()
    const [printingId, setPrintingId] = useState<string | null>(null)

    const handlePrintClick = async (e: React.MouseEvent, subscriptionId: string) => {
        e.stopPropagation() // Empêche la propagation de l'événement
        
        if (onPrintCard) {
            onPrintCard(subscriptionId)
        } else {
            setPrintingId(subscriptionId)
            printCardMutation.mutate(subscriptionId, {
                onSettled: () => {
                    setPrintingId(null)
                },
            })
        }
    }
    if (loading)
        return (
            <div className="flex justify-center items-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        )

    if (error)
        return (
            <p className="text-red-500 text-center">Erreur lors du chargement des abonnements.</p>
        )

    if (!subscriptions.length)
        return <p className="text-gray-500 text-center py-6">Aucun abonnement trouvé.</p>

    return (
        <div className="w-full">
            {/* TABLE DESKTOP */}
            <div className="hidden md:block rounded-lg border border-border bg-card">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Abonné</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Début</TableHead>
                            <TableHead>Fin</TableHead>
                            <TableHead>Statut</TableHead>
                            {(onSuspend || onPrintCard) && <TableHead>Action</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscriptions.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell className="font-medium">{s.subscriberName}</TableCell>
                                <TableCell className="capitalize">{s.category ?? '—'}</TableCell>
                                <TableCell>
                                    {new Date(s.startDate).toLocaleDateString('fr-FR')}
                                </TableCell>
                                <TableCell>
                                    {new Date(s.endDate).toLocaleDateString('fr-FR')}
                                </TableCell>
                                <TableCell>
                                    {s.status === 'valide' ? (
                                        <span className="text-green-600 font-medium flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4" /> Actif
                                        </span>
                                    ) : s.status === 'expire' ? (
                                        <span className="text-gray-600 font-medium flex items-center gap-1">
                                            <Clock className="w-4 h-4" /> Expiré
                                        </span>
                                    ) : (
                                        <span className="text-yellow-600 font-medium flex items-center gap-1">
                                            <PauseCircle className="w-4 h-4" /> Suspendu
                                        </span>
                                    )}
                                </TableCell>
                                {(onSuspend || onPrintCard) && s.status === 'valide' && (
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {onSuspend && (
                                                <Button
                                                    size="sm"
                                                    disabled={suspending}
                                                    onClick={() => onSuspend(s.id)}
                                                >
                                                    {suspending ? (
                                                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                                    ) : (
                                                        'Suspendre'
                                                    )}
                                                </Button>
                                            )}
                                            {onPrintCard && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={printingId === s.id || printCardMutation.isPending}
                                                    onClick={(e) => handlePrintClick(e, s.id)}
                                                    className="flex items-center gap-1"
                                                >
                                                    {printingId === s.id || printCardMutation.isPending ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Impression...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Printer className="w-4 h-4" />
                                                            Imprimer
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination desktop */}
                {meta && (
                    <div className="flex justify-between items-center p-3 text-sm text-muted-foreground">
                        <span>
                            Page {meta.currentPage} / {meta.lastPage}
                        </span>
                        <div className="space-x-2">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={meta.currentPage <= 1}
                                onClick={() => onPageChange?.(meta.currentPage - 1)}
                            >
                                Précédent
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={meta.currentPage >= meta.lastPage}
                                onClick={() => onPageChange?.(meta.currentPage + 1)}
                            >
                                Suivant
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* 📱 CARTES MOBILE */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {subscriptions.map((s) => (
                    <SubscriptionCard
                        key={s.id}
                        id={s.id}
                        subscriberName={s.subscriberName}
                        category={s.category}
                        startDate={s.startDate}
                        endDate={s.endDate}
                        status={s.status}
                        onSuspend={onSuspend}
                        suspending={suspending}
                        onPrintCard={onPrintCard}
                    />
                ))}

                {meta && (
                    <div className="flex justify-between items-center p-3 text-sm text-muted-foreground">
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={meta.currentPage <= 1}
                            onClick={() => onPageChange?.(meta.currentPage - 1)}
                        >
                            Précédent
                        </Button>
                        <span>
                            Page {meta.currentPage} / {meta.lastPage}
                        </span>
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={meta.currentPage >= meta.lastPage}
                            onClick={() => onPageChange?.(meta.currentPage + 1)}
                        >
                            Suivant
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
