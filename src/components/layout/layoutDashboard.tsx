'use client'

import { useState } from 'react'
import Header from './header'
import Sidebar from './sidebar'
import MobileDrawer from './mobileDrawer'

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-background text-text transition-colors duration-300">
            {/* Sidebar desktop */}
            <Sidebar />

            {/* Drawer mobile (ouverture latérale) */}
            <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

            {/*Contenu principal */}
            <div className="flex-1 flex flex-col lg:ml-64">
                {/* Header (fixe) */}
                <Header onMenuClick={() => setDrawerOpen(true)} />

                {/* Section principale */}
                <main className="flex-1 p-4 sm:p-6 md:p-8 bg-surface rounded-t-xl shadow-inner transition-all duration-300">
                    {children}
                </main>

                {/* Pied de page */}
                <footer className="text-center py-4 text-sm text-text-secondary border-t border-border bg-surface">
                    © {new Date().getFullYear()} UPN Library — Tous droits réservés
                </footer>
            </div>
        </div>
    )
}
