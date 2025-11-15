'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Loader2, PauseCircle, CheckCircle, Printer } from 'lucide-react'
import { CardItem } from './Card'
import { LibraryCard, CardStatus } from '@/types/card'
import { usePrintCard } from '@/features/manager/hooks/useManagerCards'
import { getCategoryLabel } from '@/utils/labels'

interface Props {
    cards?: LibraryCard[]
    meta?: {
        total: number
        page: number
        lastPage: number
    }
    loading?: boolean
    error?: boolean
    onSuspend?: (id: string) => void
    suspending?: boolean
    onPageChange?: (page: number) => void
}

export function CardList({
    cards = [],
    meta,
    loading,
    error,
    onSuspend,
    suspending,
    onPageChange,
}: Props) {
    const printMutation = usePrintCard()

    if (loading)
        return (
            <div className="flex justify-center items-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        )

    if (error)
        return <p className="text-red-500 text-center">Erreur lors du chargement des cartes.</p>

    if (!cards.length)
        return <p className="text-gray-500 text-center py-6">Aucune carte trouvée.</p>

    return (
        <div className="w-full">
            {/* ===== TABLEAU (DESKTOP) ===== */}
            <div className="hidden md:block rounded-[9px] border border-border bg-card overflow-x-auto">
                <Table className="min-w-[950px]">
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Abonné</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Date d’émission</TableHead>
                            <TableHead>Date d’expiration</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {cards.map((c) => (
                            <TableRow key={c.id}>
                                <TableCell className="font-medium">{c.subscriberName}</TableCell>
                                <TableCell>{getCategoryLabel(c.category)}</TableCell>
                                <TableCell>
                                    {new Date(c.issuedAt).toLocaleDateString('fr-FR')}
                                </TableCell>
                                <TableCell>
                                    {new Date(c.expiresAt).toLocaleDateString('fr-FR')}
                                </TableCell>
                                <TableCell>
                                    {c.status === CardStatus.ACTIVE ? (
                                        <span className="flex items-center gap-1 text-green-600 font-medium">
                                            <CheckCircle className="w-4 h-4" /> Active
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-red-600 font-medium">
                                            <PauseCircle className="w-4 h-4" /> Inactive
                                        </span>
                                    )}
                                </TableCell>
                                {/* ===== ACTIONS ===== */}
                                <TableCell className="text-right flex gap-2 justify-start">
                                    {c.status === CardStatus.ACTIVE && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={suspending}
                                            onClick={() => onSuspend?.(c.id)}
                                            className="flex items-center gap-1"
                                        >
                                            {suspending ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" /> ...
                                                </>
                                            ) : (
                                                <>
                                                    <PauseCircle className="w-4 h-4" />
                                                    Désactiver
                                                </>
                                            )}
                                        </Button>
                                    )}

                                    {/*Nouveau bouton Imprimer */}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => printMutation.mutate(c.id)}
                                        disabled={printMutation.isPending}
                                        className="flex items-center gap-1"
                                    >
                                        {printMutation.isPending ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> ...
                                            </>
                                        ) : (
                                            <>
                                                <Printer className="w-4 h-4" />
                                                Imprimer
                                            </>
                                        )}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* ===== VUE MOBILE ===== */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {cards.map((c) => (
                    <CardItem key={c.id} card={c} onSuspend={onSuspend} suspending={suspending} />
                ))}
            </div>

            {/* ===== PAGINATION ===== */}
            {meta && (
                <div className="flex justify-between items-center p-3 text-sm text-muted-foreground">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={meta.page <= 1}
                        onClick={() => onPageChange?.(meta.page - 1)}
                    >
                        Précédent
                    </Button>
                    <span>
                        Page {meta.page} / {meta.lastPage}
                    </span>
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={meta.page >= meta.lastPage}
                        onClick={() => onPageChange?.(meta.page + 1)}
                    >
                        Suivant
                    </Button>
                </div>
            )}
        </div>
    )
}
