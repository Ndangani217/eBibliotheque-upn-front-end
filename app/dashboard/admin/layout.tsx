// app/layout.tsx
export const metadata = {
    title: 'Espace administrateur',
    description: 'Tableau de bord Administrateur',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <div className="p-6 bg-gray-50 min-h-screen">{children}</div>
}
