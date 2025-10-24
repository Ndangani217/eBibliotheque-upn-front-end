'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth/store'
import { useGenerateVoucher } from '@/features/subscriber/hooks/useSubscriptions'
import { typography } from '@/constants/theme'
import { DollarSign, Clock, Star, ShieldCheck, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function SubscriptionCards() {
    const { user } = useAuthStore()
    const generateVoucher = useGenerateVoucher()
    const [loadingCard, setLoadingCard] = useState<number | null>(null)

    const formulas =
        user?.category === 'student'
            ? [
                  { id: 1, duration: 3, price: 5, color: 'from-blue-500 to-sky-400', icon: Star },
                  {
                      id: 2,
                      duration: 6,
                      price: 10,
                      color: 'from-indigo-500 to-blue-400',
                      icon: ShieldCheck,
                  },
                  {
                      id: 3,
                      duration: 12,
                      price: 15,
                      color: 'from-purple-500 to-indigo-400',
                      icon: Zap,
                  },
              ]
            : [
                  {
                      id: 4,
                      duration: 3,
                      price: 10,
                      color: 'from-teal-500 to-emerald-400',
                      icon: Star,
                  },
                  {
                      id: 5,
                      duration: 6,
                      price: 15,
                      color: 'from-cyan-500 to-teal-400',
                      icon: ShieldCheck,
                  },
                  {
                      id: 6,
                      duration: 12,
                      price: 20,
                      color: 'from-emerald-500 to-green-400',
                      icon: Zap,
                  },
              ]

    const handleGenerate = async (duration: number) => {
        setLoadingCard(duration)
        generateVoucher.mutate(
            { category: user?.category ?? 'student', duration },
            { onSettled: () => setLoadingCard(null) },
        )
    }

    return (
        <section className="mt-10 w-full">
            <h2 className={`${typography.h2} mb-6 text-center`}>
                Choisissez votre formule d’abonnement
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {formulas.map(({ id, duration, price, color, icon: Icon }) => (
                    <motion.div
                        key={id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="w-full"
                    >
                        <Card
                            className="relative border border-border shadow-card hover:shadow-xl 
                                       hover:border-primary transition-all duration-300 
                                       overflow-hidden bg-surface rounded-2xl"
                        >
                            <div
                                className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${color}`}
                            />

                            <CardHeader className="pt-6 text-center">
                                <div className="flex justify-center mb-3">
                                    <div
                                        className={`p-3 rounded-full bg-gradient-to-r ${color} text-white shadow-md`}
                                    >
                                        <Icon size={22} />
                                    </div>
                                </div>
                                <CardTitle className="text-primary text-lg font-semibold">
                                    {duration} mois
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="flex flex-col items-center justify-between text-center gap-3 p-6">
                                <div className="flex items-center gap-2 text-lg font-semibold">
                                    <DollarSign size={18} className="text-primary" />
                                    <span>
                                        {price} USD{' '}
                                        <span className="text-text-secondary text-sm font-normal">
                                            / forfait
                                        </span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                    <Clock size={14} />
                                    <span>Durée : {duration} mois</span>
                                </div>

                                <Button
                                    className="mt-2 w-full bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg shadow-button py-2 sm:py-3 text-sm sm:text-base"
                                    onClick={() => handleGenerate(duration)}
                                    disabled={loadingCard === duration}
                                >
                                    {loadingCard === duration ? 'Génération...' : 'Générer le bon'}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
