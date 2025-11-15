'use client'

import { usePayments } from '@/features/subscriber/hooks/usePayments'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download } from 'lucide-react'
import { typography } from '@/constants/theme'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/utils/date'

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
        <section className="bg-surface border border-border rounded-[9px] shadow-card p-6">
            <h2 className={`${typography.h2} mb-4`}>Historique des paiements</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Référence</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Durée</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vouchers?.map((v) => (
                        <TableRow key={v.id}>
                            <TableCell className="text-text">{v.reference_code}</TableCell>
                            <TableCell className="font-semibold text-text-secondary">{v.amount} USD</TableCell>
                            <TableCell className="text-text-secondary">{v.duration ?? '—'} mois</TableCell>
                            <TableCell>
                                <Badge variant="secondary" className={`${getBadgeStyle(v.status)} capitalize`}>
                                    {translateStatus(v.status)}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                {v.status?.toLowerCase() === 'paye' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="inline-flex items-center gap-2 rounded-[9px] text-primary hover:text-primary-dark hover:bg-primary/10"
                                        onClick={() =>
                                            window.open(`/api/payments/vouchers/${v.id}/receipt`)
                                        }
                                    >
                                        <Download size={16} />
                                        Télécharger
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    )
}
