'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, Clock, Check } from 'lucide-react'
import type { Payment, PaginationMeta } from '@/features/manager/hooks/useManagerPayments'
import NumberedPagination from '@/components/ui/NumberedPagination'
import { formatDate } from '@/utils/date'
import { getCategoryLabel } from '@/utils/labels'

interface Props {
    payments?: Payment[]
    meta?: PaginationMeta
    loading?: boolean
    error?: boolean
    onValidate?: (id: string) => void
    validating?: boolean
    onPageChange?: (page: number) => void
}

/**
 * 🧾 Liste des paiements — Table (desktop) + Cartes (mobile)
 */
export function PaymentList({
    payments = [],
    meta,
    loading,
    error,
    onValidate,
    validating,
    onPageChange,
}: Props) {
    if (loading)
        return (
            <div className="flex justify-center items-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        )

    if (error)
        return <p className="text-red-500 text-center">Erreur lors du chargement des paiements.</p>

    if (!payments.length)
        return <p className="text-gray-500 text-center py-6">Aucun paiement trouvé.</p>

    return (
        <div className="w-full">
            {/* TABLE DESKTOP */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Référence</TableHead>
                            <TableHead>Abonné</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Date</TableHead>
                            {onValidate && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell className="font-medium text-text">{p.referenceCode}</TableCell>
                                <TableCell className="text-text">{p.subscriberName}</TableCell>
                                <TableCell className="text-text-secondary">{getCategoryLabel(p.category)}</TableCell>
                                <TableCell className="text-text-secondary">{p.amount} USD</TableCell>
                                <TableCell>
                                    {p.status === 'paye' ? (
                                        <span className="text-success font-medium flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4" /> Payé
                                        </span>
                                    ) : (
                                        <span className="text-warning-600 font-medium flex items-center gap-1">
                                            <Clock className="w-4 h-4" /> En attente
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-text-secondary">
                                    {formatDate(p.createdAt)}
                                </TableCell>
                                {onValidate && (
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            disabled={validating}
                                            onClick={() => onValidate(p.id)}
                                            variant="outline"
                                            className="inline-flex items-center gap-2 rounded-[9px] text-primary hover:text-primary-dark hover:bg-primary/10"
                                        >
                                            {validating ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Validation...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    Valider
                                                </>
                                            )}
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* 📱 CARTES MOBILE */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {payments.map((p) => (
                    <Card key={p.id} className="shadow-sm border border-border">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">
                                {p.subscriberName}
                            </CardTitle>
                            <p className="text-sm text-gray-500">{p.referenceCode}</p>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Montant :</span>
                                <span className="font-medium">{p.amount} USD</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Catégorie :</span>
                                <span>{getCategoryLabel(p.category)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Statut :</span>
                                <span
                                    className={`font-medium ${
                                        p.status === 'paye' ? 'text-green-600' : 'text-yellow-600'
                                    }`}
                                >
                                    {p.status === 'paye' ? 'Payé' : 'En attente'}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Date :</span>
                                <span>{new Date(p.createdAt).toLocaleDateString('fr-FR')}</span>
                            </div>

                            {onValidate && p.status === 'en_attente' && (
                                <Button
                                    className="w-full mt-3 flex items-center justify-center gap-2"
                                    disabled={validating}
                                    onClick={() => onValidate(p.id)}
                                >
                                    {validating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Validation...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Valider le paiement
                                        </>
                                    )}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}

                
            </div>
            {/* Pagination unifiée */}
            {meta && (
                <div className="py-3">
                    <NumberedPagination
                        currentPage={meta.current_page}
                        totalPages={meta.last_page}
                        onPageChange={(p) => onPageChange?.(p)}
                    />
                </div>
            )}
        </div>
    )
}
