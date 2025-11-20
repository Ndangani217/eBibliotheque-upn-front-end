'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

type PaginationProps = {
	totalPages: number
	currentPage: number
	onPageChange: (page: number) => void
	className?: string
}

function buildPages(current: number, total: number): (number | '...')[] {
	// Desktop: fenêtres avec ellipses
	const pages: (number | '...')[] = []
	if (total <= 7) {
		for (let i = 1; i <= total; i += 1) pages.push(i)
		return pages
	}
	pages.push(1, 2)
	const start = Math.max(3, current - 1)
	const end = Math.min(total - 2, current + 1)
	if (start > 3) pages.push('...')
	for (let i = start; i <= end; i += 1) pages.push(i)
	if (end < total - 2) pages.push('...')
	pages.push(total - 1, total)
	return pages
}

export function Pagination({ totalPages, currentPage, onPageChange, className }: PaginationProps) {
	const canPrev = currentPage > 1
	const canNext = currentPage < totalPages

	const go = (p: number) => {
		if (p < 1 || p > totalPages || p === currentPage) return
		onPageChange(p)
	}

	const pages = buildPages(currentPage, totalPages)

	return (
		<nav className={clsx('w-full flex items-center justify-center mt-6', className)}>
			{/* Mobile: Prev - current - Next */}
			<div className="flex items-center gap-2 sm:hidden">
				<button
					aria-label="Page précédente"
					disabled={!canPrev}
					onClick={() => go(currentPage - 1)}
					className={clsx(
						'px-3 py-2 border rounded-none text-gray-900 transition-colors',
						'border-gray-300 hover:bg-gray-100',
						!canPrev && 'opacity-50 cursor-not-allowed text-gray-400',
					)}
				>
					<ChevronLeft className="w-6 h-6" />
				</button>
				<span className="px-3 py-2 border rounded-none border-gray-300 text-lg">{currentPage}</span>
				<button
					aria-label="Page suivante"
					disabled={!canNext}
					onClick={() => go(currentPage + 1)}
					className={clsx(
						'px-3 py-2 border rounded-none text-gray-900 transition-colors',
						'border-gray-300 hover:bg-gray-100',
						!canNext && 'opacity-50 cursor-not-allowed text-gray-400',
					)}
				>
					<ChevronRight className="w-6 h-6" />
				</button>
			</div>

			{/* Desktop: fenêtré + ellipses */}
			<div className="hidden sm:flex items-center gap-2">
				<button
					aria-label="Page précédente"
					disabled={!canPrev}
					onClick={() => go(currentPage - 1)}
					className={clsx(
						'px-3 py-2 border rounded-none text-gray-900 transition-colors',
						'border-gray-300 hover:bg-gray-100',
						!canPrev && 'opacity-50 cursor-not-allowed text-gray-400',
					)}
				>
					<ChevronLeft className="w-6 h-6" />
				</button>

				{pages.map((p, idx) =>
					p === '...' ? (
						<span key={`ellipsis-${idx}`} className="px-2 text-lg text-gray-500">
							…
						</span>
					) : (
						<button
							key={`page-${p}`}
							onClick={() => go(p)}
							aria-current={p === currentPage ? 'page' : undefined}
							className={clsx(
								'min-w-[40px] px-3 py-2 border rounded-none text-lg transition-colors',
								p === currentPage
									? 'bg-[#0033CC] text-white border-[#0033CC]'
									: 'border-gray-300 text-gray-900 hover:bg-gray-100',
							)}
						>
							{p}
						</button>
					),
				)}

				<button
					aria-label="Page suivante"
					disabled={!canNext}
					onClick={() => go(currentPage + 1)}
					className={clsx(
						'px-3 py-2 border rounded-none text-gray-900 transition-colors',
						'border-gray-300 hover:bg-gray-100',
						!canNext && 'opacity-50 cursor-not-allowed text-gray-400',
					)}
				>
					<ChevronRight className="w-6 h-6" />
				</button>
			</div>
		</nav>
	)
}

export default Pagination


