'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface PaymentCardProps {
    id: string
    subscriberName: string
    amount: number
    status: 'en_attente' | 'paye'
    createdAt: string
    onValidate?: (id: string) => void
    validating?: boolean
}

export function PaymentCard({
    id,
    subscriberName,
    amount,
    status,
    createdAt,
    onValidate,
    validating,
}: PaymentCardProps) {
    return (
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="w-full">
            <Card className="border-border shadow-md hover:shadow-lg transition-all duration-200">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">{subscriberName || '—'}</CardTitle>
                    {status === 'paye' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                        <Clock className="w-5 h-5 text-amber-500" />
                    )}
                </CardHeader>

                <CardContent className="space-y-2 text-sm">
                    <p>
                        <span className="font-medium">Montant :</span> {amount} USD
                    </p>
                    <p>
                        <span className="font-medium">Date :</span>{' '}
                        {format(new Date(createdAt), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                    <p>
                        <span className="font-medium">Statut :</span>{' '}
                        {status === 'en_attente' ? 'En attente' : 'Validé'}
                    </p>

                    {onValidate && status === 'en_attente' && (
                        <Button
                            variant="default"
                            size="sm"
                            className="w-full mt-2 text-white"
                            onClick={() => onValidate(id)}
                            disabled={validating}
                        >
                            {validating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Validation...
                                </>
                            ) : (
                                'Valider le paiement'
                            )}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}
