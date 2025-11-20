import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    
    // Gérer le format "dd/MM/yyyy" retourné par le backend
    let date: Date
    if (dateStr.includes('/')) {
        // Format "dd/MM/yyyy"
        const [day, month, year] = dateStr.split('/').map(Number)
        date = new Date(year, month - 1, day)
    } else {
        // Format ISO ou autre format standard
        date = new Date(dateStr)
    }

    if (isNaN(date.getTime())) return '—'

    const formatted = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })

    return capitalize(formatted)
}

export function formatDateSafe(date: string | null | undefined): string {
    if (!date) return '—'
    const parsed = new Date(date)
    return isNaN(parsed.getTime()) ? '—' : format(parsed, 'dd MMMM yyyy', { locale: fr })
}
