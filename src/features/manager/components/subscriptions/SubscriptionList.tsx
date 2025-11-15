'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, Clock, PauseCircle, Printer, Ban } from 'lucide-react'
import { useState } from 'react'
import type { PaginationMeta } from '@/features/manager/hooks/useManagerSubscriptions'
import { usePrintCardBySubscription } from '@/features/manager/hooks/useManagerSubscriptions'
import { Subscription } from '@/types/subscription'
import { SubscriptionCard } from './SubscriptionCard'
import NumberedPagination from '@/components/ui/NumberedPagination'
import { formatDate } from '@/utils/date'
import { getCategoryLabel } from '@/utils/labels'

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
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Abonné</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Début</TableHead>
                            <TableHead>Fin</TableHead>
                            <TableHead>Statut</TableHead>
                            {(onSuspend || onPrintCard) && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscriptions.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell className="font-medium text-text">{s.subscriberName}</TableCell>
                                <TableCell className="text-text-secondary">{getCategoryLabel(s.category)}</TableCell>
                                <TableCell className="text-text-secondary">{formatDate(s.startDate)}</TableCell>
                                <TableCell className="text-text-secondary">{formatDate(s.endDate)}</TableCell>
                                <TableCell>
                                    {s.status === 'valide' ? (
                                        <span className="text-success font-medium flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4" /> Actif
                                        </span>
                                    ) : s.status === 'expire' ? (
                                        <span className="text-text-secondary font-medium flex items-center gap-1">
                                            <Clock className="w-4 h-4" /> Expiré
                                        </span>
                                    ) : (
                                        <span className="text-warning-600 font-medium flex items-center gap-1">
                                            <PauseCircle className="w-4 h-4" /> Suspendu
                                        </span>
                                    )}
                                </TableCell>
                                {(onSuspend || onPrintCard) && s.status === 'valide' && (
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {onSuspend && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={suspending}
                                                    onClick={() => onSuspend(s.id)}
                                                    className="flex items-center gap-2 rounded-[9px] text-primary hover:text-primary-dark hover:bg-primary/10"
                                                >
                                                    {suspending ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Suspension...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Ban className="w-4 h-4" />
                                                            Suspendre
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                            {onPrintCard && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={printingId === s.id || printCardMutation.isPending}
                                                    onClick={(e) => handlePrintClick(e, s.id)}
                                                    className="flex items-center gap-2 rounded-[9px] text-primary hover:text-primary-dark hover:bg-primary/10"
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

                
            </div>
            {/* Pagination unifiée */}
            {meta && (
                <div className="py-3">
                    <NumberedPagination
                        currentPage={meta.currentPage}
                        totalPages={meta.lastPage}
                        onPageChange={(p) => onPageChange?.(p)}
                    />
                </div>
            )}
        </div>
    )
}
