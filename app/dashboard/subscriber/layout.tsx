// app/layout.tsx
export const metadata = {
    title: 'Espace Étudiant',
    description: 'Tableau de bord pour étudiants',
}

export default function SubscriberLayout({ children }: { children: React.ReactNode }) {
    return <div className="p-6 bg-gray-50 min-h-screen">{children}</div>
}
