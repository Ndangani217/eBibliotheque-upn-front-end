export const CATEGORY_LABELS: Record<string, string> = {
	student: 'Étudiant',
	researcher: 'Chercheur',
}

export function getCategoryLabel(category?: string | null): string {
	if (!category) return '—'
	return CATEGORY_LABELS[category] ?? category
}


