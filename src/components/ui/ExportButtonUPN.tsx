'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { FileSpreadsheet } from 'lucide-react'
import { cn } from '@/lib/utils'

type ExportButtonUPNProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	label?: string
	variant?: 'solid' | 'outline'
	iconSize?: number
	loading?: boolean
	fullWidth?: boolean
	leftIcon?: React.ReactNode
}

export function ExportButtonUPN({
	label = 'Exporter',
	variant = 'solid',
	iconSize = 18,
	loading = false,
	fullWidth = false,
	leftIcon,
	className,
	children,
	disabled,
	...props
}: ExportButtonUPNProps) {
	const isOutline = variant === 'outline'

	const baseSolid =
		'flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-surface font-medium rounded-[9px] py-2 shadow-button transition-all duration-200'
	const baseOutline =
		'flex items-center gap-2 rounded-[9px] text-primary hover:text-primary-dark hover:bg-primary/10 transition-all duration-200 border'

	return (
		<Button
			disabled={disabled || loading}
			className={cn(
				isOutline ? baseOutline : baseSolid,
				!fullWidth && !isOutline && 'px-4',
				fullWidth && 'w-full',
				className,
			)}
			{...props}
		>
			{loading ? (
				children ?? 'Export...'
			) : (
				<>
					<span className="mr-2 inline-flex">
						{leftIcon ?? <FileSpreadsheet width={iconSize} height={iconSize} />}
					</span>
					{label}
				</>
			)}
		</Button>
	)
}

export default ExportButtonUPN


