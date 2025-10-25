const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)

    if (isNaN(date.getTime())) return '—'

    const formatted = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })

    return capitalize(formatted)
}
