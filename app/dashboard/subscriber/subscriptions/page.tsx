'use client'

import SubscriptionCards from '@/features/subscriber/components/SubscriptionCards'
import { typography } from '@/constants/theme'

export default function SubscriberDashboard() {
    return (
        <main className="p-6 bg-background min-h-screen">
            <h1 className={`${typography.h1} mb-6`}>Tableau de bord — Abonné</h1>

            {/* Section Formules */}
            <SubscriptionCards />
        </main>
    )
}
