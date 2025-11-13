/**
 * Utilitaires pour le téléchargement de fichiers
 */

/**
 * Télécharge un blob en tant que fichier
 * @param blob - Le blob à télécharger
 * @param filename - Le nom du fichier
 */
export function downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}

