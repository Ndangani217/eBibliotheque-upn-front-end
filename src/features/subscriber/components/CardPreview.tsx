'use client'

import { useCard, downloadCard } from '@/features/subscriber/hooks/useCard'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { typography } from '@/constants/theme'

export default function CardPreview() {
    const { data: card, isLoading } = useCard()

    if (isLoading) {
        return <p className={`${typography.body} text-center mt-10`}>Chargement...</p>
    }

    if (!card) {
        return (
            <p className={`${typography.small} text-center text-text-secondary mt-10`}>
                Aucune carte active pour le moment.
            </p>
        )
    }

    return (
        <section className="flex flex-col items-center bg-surface border border-border rounded-xl shadow-card p-8 space-y-4 mt-8">
            <img
                src={card.qr_code_path}
                alt="QR Code de la carte"
                className="w-48 h-48 rounded-lg border border-border"
            />
            <h2 className={`${typography.h2} text-primary`}>Carte d’abonnement</h2>
            <p className={`${typography.small} text-text-secondary text-center`}>
                Valide du {card.subscription?.start_date} au {card.subscription?.end_date}
            </p>
            <Button
                onClick={() => downloadCard(card.id)}
                className="form-button flex items-center gap-2 w-auto"
            >
                <Download size={18} /> Télécharger la carte
            </Button>
        </section>
    )
}
