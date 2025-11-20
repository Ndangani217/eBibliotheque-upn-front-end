'use client'

import { QRCodeCanvas } from 'qrcode.react'
import { formatDate } from '@/utils/date'
import { useCard } from '@/features/subscriber/hooks/useCard'
import { typography } from '@/constants/theme'
import { CreditCard } from 'lucide-react'
import { getCategoryLabel } from '@/utils/labels'

export default function CardPreview() {
    const { data: card, isLoading } = useCard()

    if (isLoading) {
        return <p className={`${typography.body} text-center mt-10`}>Chargement...</p>
    }

    if (!card) {
        return (
			<div className="mt-10 flex flex-col items-center justify-center text-center">
				<CreditCard className="w-16 h-16 text-gray-400 mb-3" />
				<p className={`${typography.small} text-text-secondary`}>
					Aucune carte active pour le moment.
				</p>
			</div>
        )
    }

    const isActive = card.is_active
    const verifyUrl = `https://ebibliotheque-upn.cd/verify/${card.unique_code}`

    return (
        <section className="w-full flex justify-center items-start px-4 md:px-0 py-4 md:py-6">
            <div className="w-full max-w-[380px]">
                <div
                    className="
                        w-full border border-[#002B7F] rounded-none
                        bg-[linear-gradient(160deg,#003399_0%,#0049C6_45%,#002B7F_100%)]
                        text-white shadow-[0_0_15px_rgba(0,0,0,0.15)]
                        p-5 md:p-6 space-y-5
                    "
                >
                    {/* En-tête */}
                    <h2 className="text-center text-2xl md:text-3xl font-semibold tracking-wide whitespace-nowrap">
                    Carte d&apos;abonnement
                </h2>

                    {/* QR Code dynamique */}
                    <div className="flex justify-center">
                        <div className="mx-auto w-[120px] h-[120px] md:w-[160px] md:h-[160px] bg-white rounded-none p-2 flex items-center justify-center">
                            <QRCodeCanvas
                                value={verifyUrl}
                                size={140}
                                bgColor="#FFFFFF"
                                fgColor="#000000"
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                    </div>

                    {/* Infos principales */}
                    <div className="text-center space-y-2">
                        <p className="uppercase font-semibold tracking-wider text-lg md:text-xl">
                            {getCategoryLabel(card.subscription?.category).toUpperCase()}
                        </p>

                        <p className="text-sm md:text-base">
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
                        className={`mx-auto w-fit px-4 md:px-6 py-1 md:py-2 font-medium text-sm md:text-base rounded-none ${
                            isActive
                                ? 'bg-[#2ECC71] text-[#1A1A1A]'
                                : 'bg-[#E74C3C] text-white'
                        }`}
                    >
                        Statut : {isActive ? 'Active' : 'Inactive'}
                    </div>

                    {/* Signature officielle UPN */}
                    <div className="text-center space-y-1">
                        <p className="text-xs md:text-sm font-bold text-white/90">Signature officielle UPN</p>
                        <p className="text-xs md:text-sm text-white/70">Université Pédagogique Nationale</p>
                    </div>

                    {/* Bas de carte */}
                    <div className="text-center text-xs md:text-sm text-white/80">
                        © Bibliothèque UPN
                    </div>
                </div>
            </div>
        </section>
    )
}
