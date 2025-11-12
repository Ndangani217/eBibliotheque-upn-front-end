'use client'

import { motion } from 'framer-motion'
import { Card as UICard, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, PauseCircle, Printer } from 'lucide-react'
import { formatDateSafe } from '@/utils/date'
import type { LibraryCard } from '@/types/card'
import { usePrintCard } from '@/features/manager/hooks/useManagerCards'
import { CardStatus } from '@/types/card'

interface CardItemProps {
    card: LibraryCard
    onSuspend?: (id: string) => void
    suspending?: boolean
}

export function CardItem({ card, onSuspend, suspending }: CardItemProps) {
    const { id, subscriberName, category, issuedAt, expiresAt, status } = card
    const printMutation = usePrintCard()

    /**
     * Icône selon le statut
     */
    const renderStatusIcon = () => {
        switch (status) {
            case CardStatus.ACTIVE:
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case CardStatus.INACTIVE:
                return <PauseCircle className="w-5 h-5 text-red-500" />
            default:
                return null
        }
    }

    return (
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="w-full">
            <UICard className="border-border shadow-sm hover:shadow-md transition">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">{subscriberName}</CardTitle>
                    {renderStatusIcon()}
                </CardHeader>

                <CardContent className="space-y-2 text-sm">
                    <p>
                        <span className="font-medium">Catégorie :</span>{' '}
                        <span className="capitalize">{category}</span>
                    </p>
                    <p>
                        <span className="font-medium">Émise le :</span> {formatDateSafe(issuedAt)}
                    </p>
                    <p>
                        <span className="font-medium">Expire le :</span> {formatDateSafe(expiresAt)}
                    </p>
                    <p>
                        <span className="font-medium">Statut :</span>{' '}
                        <span
                            className={`${
                                status === CardStatus.ACTIVE ? 'text-green-600' : 'text-red-600'
                            } font-medium`}
                        >
                            {status === CardStatus.ACTIVE ? 'Active' : 'Inactive'}
                        </span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 mt-3">
                        {status === CardStatus.ACTIVE && (
                            <Button
                                variant="destructive"
                                size="sm"
                                className="w-full"
                                onClick={() => onSuspend?.(id)}
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

                        {/*Bouton Imprimer */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => printMutation.mutate(id)}
                            disabled={printMutation.isPending}
                        >
                            {printMutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Impression...
                                </>
                            ) : (
                                <>
                                    <Printer className="w-4 h-4 mr-2" />
                                    Imprimer
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </UICard>
        </motion.div>
    )
}

