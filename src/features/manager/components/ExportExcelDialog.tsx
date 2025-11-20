'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Loader2, Download, FileSpreadsheet } from 'lucide-react'
import { toast } from 'sonner'
import { ExportButtonUPN } from '@/components/ui/ExportButtonUPN'

interface ExportExcelDialogProps {
    title: string
    description: string
    onExport: (startDate: string, endDate: string) => Promise<void>
    triggerLabel?: string
}

export function ExportExcelDialog({
    title,
    description,
    onExport,
    triggerLabel = 'Exporter en Excel',
}: ExportExcelDialogProps) {
    const [open, setOpen] = useState(false)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [loading, setLoading] = useState(false)

    // Définir les dates par défaut (mois en cours)
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const defaultStartDate = firstDay.toISOString().split('T')[0]
    const defaultEndDate = lastDay.toISOString().split('T')[0]

    const handleExport = async () => {
        if (!startDate || !endDate) {
            toast.error('Veuillez sélectionner une période')
            return
        }

        if (new Date(startDate) > new Date(endDate)) {
            toast.error('La date de début doit être antérieure à la date de fin')
            return
        }

        setLoading(true)
        try {
            await onExport(startDate, endDate)
            toast.success('Export réussi ! Le téléchargement va commencer.')
            setOpen(false)
            setStartDate('')
            setEndDate('')
        } catch (error) {
            toast.error("Erreur lors de l'export")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <ExportButtonUPN
                    variant="solid"
                    label={triggerLabel}
                    leftIcon={<FileSpreadsheet width={18} height={18} />}
                />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="startDate">Date de début</Label>
                        <Input
                            id="startDate"
                            type="date"
                            value={startDate || defaultStartDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            max={endDate || defaultEndDate}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="endDate">Date de fin</Label>
                        <Input
                            id="endDate"
                            type="date"
                            value={endDate || defaultEndDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate || defaultStartDate}
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Annuler
                    </Button>
                    <ExportButtonUPN
                        onClick={handleExport}
                        disabled={loading}
                        label={loading ? 'Export en cours...' : 'Exporter'}
                        leftIcon={
                            loading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4 mr-2" />
                            )
                        }
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
