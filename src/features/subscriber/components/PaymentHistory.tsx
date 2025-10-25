'use client'

import { usePayments } from '@/features/subscriber/hooks/usePayments'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download } from 'lucide-react'
import { typography } from '@/constants/theme'

export default function PaymentHistory() {
    const { data: vouchers, isLoading } = usePayments()

    if (isLoading) {
        return <p className={`${typography.body} text-center mt-10`}>Chargement...</p>
    }

    const getBadgeStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paye':
                return 'bg-green-500 text-white'
            case 'en_attente':
                return 'bg-yellow-400 text-gray-900'
            case 'expire':
                return 'bg-red-500 text-white'
            default:
                return 'bg-gray-300 text-gray-800'
        }
    }

    const translateStatus = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paye':
                return 'Payé'
            case 'en_attente':
                return 'En attente'
            case 'expire':
                return 'Expiré'
            default:
                return status
        }
    }

    return (
        <section className="bg-surface border border-border rounded-xl shadow-card p-6">
            <h2 className={`${typography.h2} mb-4`}>Historique des paiements</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-background border-b border-border">
                        <tr>
                            <th className="p-3 text-left">Référence</th>
                            <th className="p-3 text-left">Montant</th>
                            <th className="p-3 text-left">Durée</th>
                            <th className="p-3 text-left">Statut</th>
                            <th className="p-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vouchers?.map((v) => (
                            <tr
                                key={v.id}
                                className="border-b border-border hover:bg-gray-50 dark:hover:bg-darkSurface transition"
                            >
                                <td className="p-3">{v.reference_code}</td>
                                <td className="p-3 font-semibold">{v.amount} USD</td>
                                <td className="p-3">{v.duration ?? '—'} mois</td>
                                <td className="p-3">
                                    <Badge
                                        variant="secondary"
                                        className={`${getBadgeStyle(v.status)} capitalize`}
                                    >
                                        {translateStatus(v.status)}
                                    </Badge>
                                </td>
                                <td className="p-3 text-center">
                                    {v.status?.toLowerCase() === 'paye' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-primary border-primary hover:bg-primary hover:text-white"
                                            onClick={() =>
                                                window.open(
                                                    `/api/payments/vouchers/${v.id}/receipt`,
                                                )
                                            }
                                        >
                                            <Download size={16} />
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
