'use client'

import { motion } from 'framer-motion'
import { Sparkles, DollarSign, CreditCard, Calendar } from 'lucide-react'
import { typography } from '@/constants/theme'
import { usePayments } from '@/features/subscriber/hooks/usePayments'
import { useCard } from '@/features/subscriber/hooks/useCard'
import SubscriptionCards from '@/features/subscriber/components/SubscriptionCards'
import CardPreview from '@/features/subscriber/components/CardPreview'

export default function SubscriberDashboard() {
    const { data: payments } = usePayments()
    const { data: card } = useCard()

    const totalPaid = payments?.filter((p) => p.status === 'payé').length ?? 0
    const isCardActive = card ? 'Active' : 'Aucune'
    const expiryDate = card?.subscription?.end_date
        ? new Date(card.subscription.end_date).toLocaleDateString()
        : '—'

    return (
        <main className="relative p-6 sm:p-10 bg-background min-h-screen overflow-hidden">
            {/*Dégradé de fond pour la profondeur */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-slate-900 dark:via-slate-950 dark:to-blue-900 opacity-60 -z-10" />

            {/* ====== En-tête ====== */}
            <header className="mb-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center justify-center gap-2"
                >
                    <Sparkles className="text-primary w-5 h-5 animate-pulse" />
                    <h1 className={`${typography.h1} text-primary`}>Espace Abonné</h1>
                    <Sparkles className="text-secondary w-5 h-5 animate-pulse" />
                </motion.div>
                <p className={`${typography.small} text-text-secondary mt-2`}>
                    Consultez vos paiements, votre carte et choisissez votre formule d’abonnement.
                </p>
            </header>

            {/* ====== Section Statistiques ====== */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-6xl mx-auto">
                {/*Paiements validés */}
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-surface border border-border shadow-card rounded-xl p-6 text-center flex flex-col items-center justify-center"
                >
                    <DollarSign className="w-8 h-8 text-primary mb-2" />
                    <p className={`${typography.h2} text-primary`}>{totalPaid}</p>
                    <p className={`${typography.small} text-text-secondary`}>Paiements validés</p>
                </motion.div>

                {/* Carte active */}
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-surface border border-border shadow-card rounded-xl p-6 text-center flex flex-col items-center justify-center"
                >
                    <CreditCard className="w-8 h-8 text-primary mb-2" />
                    <p className={`${typography.h2} text-primary`}>{isCardActive}</p>
                    <p className={`${typography.small} text-text-secondary`}>Carte d’abonnement</p>
                </motion.div>

                {/* Date d’expiration */}
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-surface border border-border shadow-card rounded-xl p-6 text-center flex flex-col items-center justify-center"
                >
                    <Calendar className="w-8 h-8 text-primary mb-2" />
                    <p className={`${typography.h2} text-primary`}>{expiryDate}</p>
                    <p className={`${typography.small} text-text-secondary`}>Date d’expiration</p>
                </motion.div>
            </section>

            {/* ====== Section Formules ====== */}
            <section className="max-w-7xl mx-auto">
                <SubscriptionCards />
            </section>

            {/* ====== Carte d’abonnement ====== */}
            <section className="max-w-5xl mx-auto mt-14">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <CardPreview />
                </motion.div>
            </section>
        </main>
    )
}
