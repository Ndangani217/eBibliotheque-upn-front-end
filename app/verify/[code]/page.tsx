'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { typography } from '@/constants/theme'
import { formatDate } from '@/utils/date'

interface VerifyResponse {
    valid: boolean
    message: string
    card: {
        uniqueCode: string
        subscriber: string
        category: string
        reference: string
        startDate: string
        endDate: string
        expired: boolean
        isActive: boolean
    }
}

export default function VerifyCardPage() {
    const { code } = useParams<{ code: string }>()
    const [data, setData] = useState<VerifyResponse | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!code) return

        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/verify/${code}`,
                )
                if (!res.ok) throw new Error('Carte non trouvée')
                const json = await res.json()
                setData(json)
            } catch (err) {
                setError((err as Error).message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [code])

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className={`${typography.body} text-center text-text-secondary`}>
                    Vérification en cours...
                </p>
            </main>
        )
    }

    if (error || !data) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className={`${typography.small} text-center text-red-600`}>
                    {error || 'Erreur lors de la vérification de la carte.'}
                </p>
            </main>
        )
    }

    const { valid, card, message } = data
    const statusColor = valid ? 'text-green-600' : 'text-red-600'
    const statusBg = valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
            <section className="max-w-md w-full bg-surface border border-border rounded-2xl shadow-card p-8 space-y-5 text-center">
                <h1 className={`${typography.h2} text-primary`}>Résultat de la vérification</h1>

                {/*Message principal */}
                <p className={`mt-3 text-lg font-semibold ${statusColor}`}>{message}</p>

                {/*Informations détaillées */}
                <div className="text-sm text-text-secondary space-y-2">
                    <p>
                        <strong>Détenteur :</strong> {card.subscriber}
                    </p>
                    <p>
                        <strong>Catégorie :</strong> {card.category}
                    </p>
                    <p>
                        <strong>Référence :</strong> {card.reference}
                    </p>
                    <p>
                        <strong>Validité :</strong> {formatDate(card.startDate)} →{' '}
                        {formatDate(card.endDate)}
                    </p>
                </div>

                {/*Statut visuel */}
                <div className={`mt-4 font-medium px-4 py-2 rounded-full inline-block ${statusBg}`}>
                    {valid ? 'Carte valide' : 'Carte expirée ou inactive'}
                </div>

                {/* Code unique affiché discrètement */}
                <p className="text-xs text-text-muted mt-4">Code : {card.uniqueCode}</p>
            </section>
        </main>
    )
}
