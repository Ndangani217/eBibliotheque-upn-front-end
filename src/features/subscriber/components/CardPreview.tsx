'use client'

import { QRCodeCanvas } from 'qrcode.react'
import { formatDate } from '@/constants/formatDate'
import { useCard } from '@/features/subscriber/hooks/useCard'
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

    const isActive = card.is_active
    const verifyUrl = `https://ebibliotheque-upn.cd/verify/${card.unique_code}`

    return (
        <section className="flex justify-center mt-10 px-4">
            <div
                className={`
          relative w-full max-w-sm rounded-3xl shadow-xl overflow-hidden
          bg-gradient-to-br from-blue-500/90 to-sky-400/80 text-white
          p-6 sm:p-8 transform transition-all hover:scale-[1.02]
        `}
            >
                {/* En-tête */}
                <h2 className="text-center text-2xl sm:text-3xl font-semibold tracking-wide mb-4 drop-shadow">
                    Carte d’abonnement
                </h2>

                {/* QR Code dynamique */}
                <div className="flex justify-center">
                    <div className="bg-white p-2 rounded-xl shadow-md">
                        <QRCodeCanvas
                            value={verifyUrl}
                            size={160}
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                </div>

                {/* Infos principales */}
                <div className="text-center mt-5 space-y-1">
                    <p className="uppercase font-bold tracking-wider text-lg sm:text-xl">
                        {card.subscription?.category === 'student'
                            ? 'ÉTUDIANT'
                            : card.subscription?.category === 'researcher'
                            ? 'CHERCHEUR'
                            : card.subscription?.category?.toUpperCase() || '—'}
                    </p>

                    <p className="text-sm sm:text-base">
                        Valide du{' '}
                        <span className="font-semibold">
                            {formatDate(card.subscription?.start_date)}
                        </span>{' '}
                        au{' '}
                        <span className="font-semibold">
                            {formatDate(card.subscription?.end_date)}
                        </span>
                    </p>
                </div>

                {/* Statut */}
                <div
                    className={`mt-6 mx-auto w-fit px-5 py-2 rounded-full font-medium text-sm sm:text-base ${
                        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
                    }`}
                >
                    Statut : {isActive ? 'Active' : 'Inactive'}
                </div>

                {/* Bas de carte */}
                <div className="absolute bottom-3 right-4 text-xs text-white/80">
                    © Bibliothèque UPN
                </div>
            </div>
        </section>
    )
}
