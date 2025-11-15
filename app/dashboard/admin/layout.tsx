// app/layout.tsx
export const metadata = {
    title: 'Espace administrateur',
    description: 'Tableau de bord Administrateur',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
