'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth/store'
import { useGenerateVoucher } from '@/features/subscriber/hooks/useSubscriptions'
import { typography, colors } from '@/constants/theme'
import { DollarSign, Clock } from 'lucide-react'

export default function SubscriptionCards() {
    const { user } = useAuthStore()
    const generateVoucher = useGenerateVoucher()

    //Définition des formules selon la catégorie
    const formulas =
        user?.category === 'student'
            ? [
                  { duration: 3, price: 5 },
                  { duration: 6, price: 10 },
                  { duration: 9, price: 15 },
              ]
            : [
                  { duration: 3, price: 10 },
                  { duration: 6, price: 15 },
                  { duration: 9, price: 20 },
              ]

    return (
        <section className="mt-6">
            <h2 className={`${typography.h2} mb-4`}>Choisissez votre formule d’abonnement</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {formulas.map(({ duration, price }) => (
                    <Card
                        key={duration}
                        className="border border-border shadow-card hover:shadow-lg hover:border-primary transition-all duration-300"
                    >
                        <CardHeader className="text-center">
                            <CardTitle className="text-primary text-lg font-semibold">
                                {duration} mois
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-col items-center justify-between h-40">
                            <div className="flex items-center gap-2 text-lg font-medium">
                                <DollarSign size={18} className="text-primary" />
                                <span>
                                    {price} USD{' '}
                                    <span className="text-text-secondary text-sm">/ forfait</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                <Clock size={14} />
                                <span>Durée : {duration} mois</span>
                            </div>

                            <Button
                                className="mt-3 w-full bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg shadow-button"
                                onClick={() =>
                                    generateVoucher.mutate({
                                        category: user?.category ?? 'student',
                                        duration,
                                    })
                                }
                                disabled={generateVoucher.isPending}
                            >
                                {generateVoucher.isPending ? 'Génération...' : 'Générer le bon'}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
