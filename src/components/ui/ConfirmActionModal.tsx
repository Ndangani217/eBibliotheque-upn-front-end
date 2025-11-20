'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import React from 'react'

type ConfirmActionModalProps = {
	open: boolean
	onConfirm: () => void
	onCancel: () => void
	title: string
	description: string
	confirmLabel: string
	cancelLabel?: string
	icon?: React.ReactNode
	danger?: boolean
}

export function ConfirmActionModal({
	open,
	onConfirm,
	onCancel,
	title,
	description,
	confirmLabel,
	cancelLabel = 'Annuler',
	icon,
	danger = false,
}: ConfirmActionModalProps) {
	return (
		<Dialog open={open} onOpenChange={(v) => (!v ? onCancel() : undefined)}>
			<DialogContent className="rounded-none border border-gray-300 p-6 max-w-md w-full transition-opacity duration-150">
				<DialogHeader>
					<DialogTitle className="text-2xl font-semibold flex items-center gap-2">
						<span className="inline-flex">
							{icon ?? <AlertTriangle className="w-6 h-6" />}
						</span>
						{title}
					</DialogTitle>
					<DialogDescription className="text-base text-gray-700">
						{description}
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="flex justify-end gap-2">
					<Button
						variant="outline"
						onClick={onCancel}
						className="rounded-none w-full sm:w-auto"
					>
						{cancelLabel}
					</Button>
					<Button
						onClick={onConfirm}
						className={`rounded-none w-full sm:w-auto flex items-center gap-2 ${danger ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-primary hover:bg-primary-dark text-white'}`}
					>
						{confirmLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default ConfirmActionModal


