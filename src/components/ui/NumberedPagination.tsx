'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

type NumberedPaginationProps = {
	currentPage: number
	totalPages: number
	onPageChange?: (page: number) => void
	className?: string
}

function buildPages(current: number, total: number): (number | '...')[] {
	const pages: (number | '...')[] = []
	const delta = 1
	const left = Math.max(2, current - delta)
	const right = Math.min(total - 1, current + delta)

	pages.push(1)

	if (left > 2) pages.push('...')

	for (let i = left; i <= right; i += 1) {
		pages.push(i)
	}

	if (right < total - 1) pages.push('...')
	if (total > 1) pages.push(total)

	return pages
}

export function NumberedPagination({
	currentPage,
	totalPages,
	onPageChange,
	className,
}: NumberedPaginationProps) {
	const canPrev = currentPage > 1
	const canNext = currentPage < totalPages

	const handleChange = (page: number) => {
		if (!onPageChange) return
		if (page < 1 || page > totalPages || page === currentPage) return
		onPageChange(page)
	}

	const pages = buildPages(currentPage, totalPages)

	return (
		<nav className={clsx('w-full flex items-center justify-center', className)}>
			{/* Mobile: condensed */}
			<div className="flex items-center gap-2 sm:hidden">
				<button
					aria-label="Page précédente"
					disabled={!canPrev}
					onClick={() => handleChange(currentPage - 1)}
					className={clsx(
						'px-3 py-1.5 border rounded-[9px] transition-all',
						'border-gray-300 hover:bg-gray-100',
						!canPrev && 'opacity-50 cursor-not-allowed',
					)}
				>
					<div className="flex items-center gap-1">
						<ChevronLeft className="w-4 h-4" />
						<span>Précédent</span>
					</div>
				</button>

				<span className="text-sm text-gray-700">{currentPage} / {totalPages}</span>

				<button
					aria-label="Page suivante"
					disabled={!canNext}
					onClick={() => handleChange(currentPage + 1)}
					className={clsx(
						'px-3 py-1.5 border rounded-[9px] transition-all',
						'border-gray-300 hover:bg-gray-100',
						!canNext && 'opacity-50 cursor-not-allowed',
					)}
				>
					<div className="flex items-center gap-1">
						<span>Suivant</span>
						<ChevronRight className="w-4 h-4" />
					</div>
				</button>
			</div>

			{/* Desktop: numbered */}
			<div className="hidden sm:flex items-center gap-2">
				<button
					aria-label="Page précédente"
					disabled={!canPrev}
					onClick={() => handleChange(currentPage - 1)}
					className={clsx(
						'px-3 py-1.5 border rounded-[9px] transition-all',
						'border-gray-300 hover:bg-gray-100',
						!canPrev && 'opacity-50 cursor-not-allowed',
					)}
				>
					<ChevronLeft className="w-4 h-4" />
				</button>

				{pages.map((p, idx) =>
					p === '...' ? (
						<span key={`ellipsis-${idx}`} className="px-2 select-none text-gray-500">
							…
						</span>
					) : (
						<button
							key={`page-${p}`}
							onClick={() => handleChange(p)}
							aria-current={p === currentPage ? 'page' : undefined}
							className={clsx(
								'min-w-[36px] px-3 py-1.5 border rounded-[9px] text-sm transition-all',
								'hover:bg-gray-100',
								p === currentPage
									? 'border-[#002F6C] text-[#002F6C] font-semibold bg-white'
									: 'border-gray-300 text-gray-700',
							)}
						>
							{p}
						</button>
					),
				)}

				<button
					aria-label="Page suivante"
					disabled={!canNext}
					onClick={() => handleChange(currentPage + 1)}
					className={clsx(
						'px-3 py-1.5 border rounded-[9px] transition-all',
						'border-gray-300 hover:bg-gray-100',
						!canNext && 'opacity-50 cursor-not-allowed',
					)}
				>
					<ChevronRight className="w-4 h-4" />
				</button>
			</div>
		</nav>
	)
}

export default NumberedPagination


