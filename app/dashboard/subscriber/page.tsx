'use client'

import CardPreview from '@/features/subscriber/components/CardPreview'
import { usePayments } from '@/features/subscriber/hooks/usePayments'
import { useCard } from '@/features/subscriber/hooks/useCard'
import { typography } from '@/constants/theme'

export default function DashboardPage() {
    const { data: payments } = usePayments()
    const { data: card } = useCard()

    const totalPaid = payments?.filter((p) => p.status === 'payé').length ?? 0

    return (
        <main className="p-6 space-y-8">
            <h1 className={`${typography.h1}`}>Tableau de bord — Abonné</h1>

            {/* Résumé en 3 cartes */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-surface border border-border shadow-card rounded-xl p-5 text-center">
                    <p className={`${typography.h2} text-primary`}>{totalPaid}</p>
                    <p className={`${typography.small} text-text-secondary`}>Paiements validés</p>
                </div>

                <div className="bg-surface border border-border shadow-card rounded-xl p-5 text-center">
                    <p className={`${typography.h2} text-primary`}>{card ? 'Active' : 'Aucune'}</p>
                    <p className={`${typography.small} text-text-secondary`}>Carte d’abonnement</p>
                </div>

                <div className="bg-surface border border-border shadow-card rounded-xl p-5 text-center">
                    <p className={`${typography.h2} text-primary`}>
                        {card?.subscription?.end_date || '—'}
                    </p>
                    <p className={`${typography.small} text-text-secondary`}>Date d’expiration</p>
                </div>
            </section>

            {/* Carte d’abonnement */}
            <CardPreview />
        </main>
    )
}
