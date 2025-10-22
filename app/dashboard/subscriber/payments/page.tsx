'use client'

import PaymentHistory from '@/features/subscriber/components/PaymentHistory'
import { typography } from '@/constants/theme'

export default function PaymentsPage() {
    return (
        <main className="p-6 space-y-6">
            <h1 className={`${typography.h1}`}>Historique des paiements</h1>
            <p className={`${typography.small} text-text-secondary`}>
                Retrouvez ici la liste de vos bons de paiement et reçus téléchargés.
            </p>
            <PaymentHistory />
        </main>
    )
}
