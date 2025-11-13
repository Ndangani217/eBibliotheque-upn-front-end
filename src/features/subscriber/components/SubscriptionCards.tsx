'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/features/auth'
import { useGenerateVoucher } from '@/features/subscriber/hooks/useSubscriptions'
import { useActiveVoucher } from '@/features/subscriber/hooks/usePayments'
import { useCard } from '@/features/subscriber/hooks/useCard'
import { typography } from '@/constants/theme'
import {
    DollarSign,
    Clock,
    Star,
    ShieldCheck,
    Zap,
    CheckCircle,
    FileText,
    AlertCircle,
    Receipt,
    Loader2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { downloadBlob } from '@/lib/fileDownload'
import { handleApiError } from '@/lib/errorHandler'
import { formatDate } from '@/utils/date'
import api from '@/services/api'

export default function SubscriptionCards() {
    const { user } = useAuthStore()
    const queryClient = useQueryClient()
    const generateVoucher = useGenerateVoucher()
    const { data: activeVoucher } = useActiveVoucher()
    const { data: activeCard } = useCard()
    const [loadingCard, setLoadingCard] = useState<number | null>(null)
    const [downloadingVoucher, setDownloadingVoucher] = useState(false)

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

    // Vérifie si un bon actif existe pour une durée donnée (non expiré)
    const hasActiveVoucherForDuration = (duration: number) => {
        if (
            !activeVoucher ||
            activeVoucher.duration !== duration ||
            activeVoucher.status !== 'en_attente'
        ) {
            return false
        }
        // Vérifier si le bon n'est pas expiré
        return !isVoucherExpired(activeVoucher)
    }

    const isVoucherExpired = (voucher: typeof activeVoucher) => {
        if (!voucher || !voucher.expiresAt) return false
        return new Date(voucher.expiresAt) < new Date()
    }

    const handleGenerate = async (duration: number) => {
        // Vérifier si un bon actif existe pour cette durée
        if (hasActiveVoucherForDuration(duration)) {
            return
        }

        setLoadingCard(duration)
        generateVoucher.mutate(
            { duration, bank: 'Rawbank' },
            {
                onSettled: () => setLoadingCard(null),
                onSuccess: () => {
                    // Invalider la requête du bon actif pour rafraîchir
                    queryClient.invalidateQueries({ queryKey: ['active-voucher'] })
                },
            },
        )
    }

    const handleViewVoucher = async () => {
        if (!activeVoucher) return

        setDownloadingVoucher(true)
        try {
            // Télécharger le PDF du bon existant
            const response = await api.get(`/payments/vouchers/${activeVoucher.id}/download`, {
                responseType: 'blob',
            })

            const blob = new Blob([response.data], { type: 'application/pdf' })
            downloadBlob(blob, `bon_de_paiement_${activeVoucher.referenceCode}.pdf`)
        } catch (error) {
            handleApiError(error, 'Erreur lors du téléchargement du bon')
            console.error('Erreur lors du téléchargement du bon:', error)
        } finally {
            setDownloadingVoucher(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'en_attente':
                return <Badge className="bg-yellow-400 text-gray-900">En attente</Badge>
            case 'paye':
                return <Badge className="bg-green-500 text-white">Payé</Badge>
            case 'expire':
                return <Badge className="bg-red-500 text-white">Expiré</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    // Vérifie si l'utilisateur a un abonnement actif (non expiré)
    const hasActiveSubscription =
        activeCard?.subscription &&
        new Date(activeCard.subscription.end_date) > new Date() &&
        (activeCard.subscription.expired === undefined || !activeCard.subscription.expired)

    const hasActiveVoucher = activeVoucher && !isVoucherExpired(activeVoucher)
    const activeVoucherExpired = activeVoucher && isVoucherExpired(activeVoucher)

    return (
        <section className="mt-10 w-full">
            <h2 className={`${typography.h2} mb-6 text-center`}>
                Choisissez votre formule d&apos;abonnement
            </h2>

            {/* Message informatif si un bon actif existe */}
            {hasActiveVoucher && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-50 border border-yellow-300 rounded-[9px] p-4 mb-6 text-[#002F6C]"
                >
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold mb-1">
                                Vous avez déjà un bon de paiement généré
                            </p>
                            <p className="text-sm">
                                Généré le <strong>{formatDate(activeVoucher.createdAt)}</strong>,
                                d&apos;un montant de <strong>{activeVoucher.amount} USD</strong>{' '}
                                pour la formule <strong>{activeVoucher.duration} mois</strong>.
                            </p>
                            {activeVoucher.expiresAt && (
                                <p className="text-sm mt-1">
                                    Ce bon est valide jusqu&apos;au{' '}
                                    <strong>{formatDate(activeVoucher.expiresAt)}</strong>.
                                </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                                {getStatusBadge(activeVoucher.status)}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleViewVoucher}
                                    disabled={downloadingVoucher}
                                    className="rounded-[9px] flex items-center gap-2"
                                >
                                    {downloadingVoucher ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Téléchargement...
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="w-4 h-4" />
                                            Voir le bon
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Message si l'utilisateur a un abonnement actif */}
            {hasActiveSubscription && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border border-blue-300 rounded-[9px] p-4 mb-6 text-[#002F6C]"
                >
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold mb-1">✅ Vous avez un abonnement actif</p>
                            <p className="text-sm">
                                Votre abonnement est valide jusqu&apos;au{' '}
                                <strong>
                                    {activeCard?.subscription?.end_date
                                        ? new Date(
                                              activeCard.subscription.end_date,
                                          ).toLocaleDateString('fr-FR', {
                                              day: 'numeric',
                                              month: 'long',
                                              year: 'numeric',
                                          })
                                        : '—'}
                                </strong>
                                .
                            </p>
                            <p className="text-sm mt-1 font-medium">
                                Vous ne pouvez pas générer un nouveau bon de paiement tant que votre
                                abonnement est actif.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Message si le bon est expiré */}
            {activeVoucherExpired && !hasActiveSubscription && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-orange-50 border border-orange-300 rounded-[9px] p-4 mb-6 text-[#002F6C]"
                >
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold mb-1">
                                Votre précédent bon de paiement a expiré
                            </p>
                            <p className="text-sm">
                                Le bon généré le{' '}
                                <strong>{formatDate(activeVoucher.createdAt)}</strong> a expiré le{' '}
                                <strong>{formatDate(activeVoucher.expiresAt)}</strong>.
                            </p>
                            <p className="text-sm mt-1 font-medium">
                                Vous pouvez en générer un nouveau maintenant.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {formulas.map(({ id, duration, price, color, icon: Icon }) => {
                    const hasActiveForThisDuration = hasActiveVoucherForDuration(duration)
                    // Un abonné ne peut générer un nouveau bon pour cette durée que s'il n'a pas d'abonnement actif ET pas de bon actif (non expiré) pour cette durée spécifique
                    const canGenerate = !hasActiveSubscription && !hasActiveForThisDuration

                    return (
                        <motion.div
                            key={id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            className="w-full relative"
                        >
                            {/*Icône discrète si le bon est déjà généré pour cette durée */}
                            {hasActiveForThisDuration && (
                                <div className="absolute top-3 right-3 text-green-500">
                                    <CheckCircle size={22} />
                                </div>
                            )}

                            <Card
                                className="relative border border-border shadow-card hover:shadow-xl 
                                           hover:border-primary transition-all duration-300 
                                           overflow-hidden bg-surface rounded-[9px]"
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
                                        className="mt-2 w-full bg-primary hover:bg-primary-dark text-white font-semibold rounded-[9px] shadow-button py-2 sm:py-3 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        onClick={() => handleGenerate(duration)}
                                        disabled={loadingCard === duration || !canGenerate}
                                    >
                                        {loadingCard === duration ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Génération...
                                            </>
                                        ) : hasActiveSubscription ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Abonnement actif
                                            </>
                                        ) : hasActiveForThisDuration && !activeVoucherExpired ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Bon déjà généré
                                            </>
                                        ) : (
                                            <>
                                                <Receipt className="w-4 h-4" />
                                                Générer le bon
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>
        </section>
    )
}
