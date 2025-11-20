'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './sidebar'

export default function ResponsiveSidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    //Détection responsive dynamique
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    //Empêche le scroll en mobile drawer
    useEffect(() => {
        if (isMobile && isOpen) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
    }, [isMobile, isOpen])

    // Mobile Drawer
    if (isMobile) {
        return (
            <>
                {/* Bouton pour ouvrir (sera dans Header) */}
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Overlay */}
                            <motion.div
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                                onClick={() => setIsOpen(false)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                            />

                            {/* Drawer */}
                            <motion.aside
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                                className="fixed top-0 left-0 h-full w-64 bg-surface border-r border-border z-50 shadow-lg"
                            >
                                <Sidebar onLinkClick={() => setIsOpen(false)} />
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>
            </>
        )
    }

    return (
        <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 border-r border-border bg-surface shadow-card z-30">
            <Sidebar />
        </aside>
    )
}
