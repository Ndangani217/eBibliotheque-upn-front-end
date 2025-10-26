'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, Clock, PauseCircle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { SubscriptionStatus } from '@/types/subscription'

interface SubscriptionCardProps {
    id: string
    subscriberName: string
    category: string
    startDate: string
    endDate: string
    status: SubscriptionStatus
    onSuspend?: (id: string) => void
    suspending?: boolean
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
}: SubscriptionCardProps) {
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

                    {onSuspend && status === 'valide' && (
                        <Button
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => onSuspend(id)}
                            disabled={suspending}
                        >
                            {suspending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Suspension...
                                </>
                            ) : (
                                'Suspendre'
                            )}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}
