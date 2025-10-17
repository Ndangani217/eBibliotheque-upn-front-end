'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './sidebar'

type MobileDrawerProps = {
    isOpen: boolean
    onClose: () => void
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay (fond semi-transparent avec effet de flou) */}
                    <motion.div
                        className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-40"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* Menu latéral animé */}
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{
                            type: 'spring',
                            stiffness: 120,
                            damping: 20,
                        }}
                        className="fixed top-0 left-0 h-full w-64 bg-surface text-text border-r border-border shadow-modal z-50"
                    >
                        <Sidebar onLinkClick={onClose} />
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    )
}
