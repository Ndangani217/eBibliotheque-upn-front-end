'use client'

import CardPreview from '@/features/subscriber/components/CardPreview'
import { typography } from '@/constants/theme'

export default function CardPage() {
    return (
        <main className="p-6 space-y-6">
            <h1 className={typography.h1}>Ma carte d’abonnement</h1>
            <p className={`${typography.small} text-text-secondary`}>
                Visualisez votre carte numérique active ci-dessous.
            </p>
            <CardPreview />
        </main>
    )
}
