'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, Clock, PauseCircle, Printer, Ban } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useState } from 'react'
import type { SubscriptionStatus } from '@/types/subscription'
import { usePrintCardBySubscription } from '@/features/manager/hooks/useManagerSubscriptions'

interface SubscriptionCardProps {
    id: string
    subscriberName: string
    category: string
    startDate: string
    endDate: string
    status: SubscriptionStatus
    onSuspend?: (id: string) => void
    suspending?: boolean
    onPrintCard?: (subscriptionId: string) => void
}

export function SubscriptionCard({
    id,
    subscriberName,
    category,
    startDate,
    endDate,
    status,
    onSuspend,
    suspending,
    onPrintCard,
}: SubscriptionCardProps) {
    const printCardMutation = usePrintCardBySubscription()
    const [isPrinting, setIsPrinting] = useState(false)

    const handlePrintClick = async (e: React.MouseEvent) => {
        e.stopPropagation() // Empêche la propagation de l'événement
        
        if (onPrintCard) {
            onPrintCard(id)
        } else {
            setIsPrinting(true)
            printCardMutation.mutate(id, {
                onSettled: () => {
                    setIsPrinting(false)
                },
            })
        }
    }
    return (
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="w-full">
            <Card className="border-border shadow-md hover:shadow-lg transition-all duration-200">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">{subscriberName || '—'}</CardTitle>
                    {status === 'valide' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : status === 'expire' ? (
                        <Clock className="w-5 h-5 text-gray-500" />
                    ) : (
                        <PauseCircle className="w-5 h-5 text-amber-500" />
                    )}
                </CardHeader>

                <CardContent className="space-y-2 text-sm">
                    <p>
                        <span className="font-medium">Catégorie :</span> {category ?? '—'}
                    </p>
                    <p>
                        <span className="font-medium">Période :</span>{' '}
                        {format(new Date(startDate), 'dd MMM yyyy', { locale: fr })} —{' '}
                        {format(new Date(endDate), 'dd MMM yyyy', { locale: fr })}
                    </p>
                    <p>
                        <span className="font-medium">Statut :</span>{' '}
                        {status === 'valide'
                            ? 'Actif'
                            : status === 'expire'
                            ? 'Expiré'
                            : 'Suspendu'}
                    </p>

                    {(onSuspend || onPrintCard) && status === 'valide' && (
                        <div className="flex flex-col gap-2 mt-2">
                            {onSuspend && (
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="w-full flex items-center justify-center gap-2 rounded-[9px] text-white shadow-button"
                                    onClick={() => onSuspend(id)}
                                    disabled={suspending}
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
                                    className="w-full flex items-center justify-center gap-2 rounded-[9px] text-primary hover:text-primary-dark hover:bg-primary/10"
                                    onClick={handlePrintClick}
                                    disabled={isPrinting || printCardMutation.isPending}
                                >
                                    {isPrinting || printCardMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Impression...
                                        </>
                                    ) : (
                                        <>
                                            <Printer className="w-4 h-4 mr-2" />
                                            Imprimer
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}
