'use client'

import { useState, useEffect } from 'react'
import Header from './header'
import Sidebar from './sidebar'
import { motion, AnimatePresence } from 'framer-motion'

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    //Détection du mode mobile
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className="flex min-h-screen bg-background text-text transition-colors duration-300">
            {/* Sidebar desktop */}
            {!isMobile && (
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
                />
            )}

            {/* Drawer mobile */}
            <AnimatePresence>
                {isMobile && drawerOpen && (
                    <>
                        {/* Overlay sombre */}
                        <motion.div
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                            onClick={() => setDrawerOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        />

                        {/* Menu mobile (Drawer) */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{
                                type: 'spring',
                                stiffness: 120,
                                damping: 20,
                            }}
                            className="fixed inset-0 w-56 bg-surface border-r border-border z-[70] shadow-lg"
                        >
                            <Sidebar onLinkClick={() => setDrawerOpen(false)} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Contenu principal */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${
                    isMobile ? '' : sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-56'
                }`}
            >
                <Header onMenuClick={() => setDrawerOpen(true)} />
				<main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-4 sm:py-6 md:py-8 bg-background transition-all duration-300">
                    {children}
                </main>
                <footer className="text-center py-4 text-sm text-text-secondary border-t border-border bg-surface">
                    © {new Date().getFullYear()} UPN Library — Tous droits réservés
                </footer>
            </div>
        </div>
    )
}
