'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './sidebar'

type MobileDrawerProps = { isOpen: boolean; onClose: () => void }

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay (fond semi-transparent) */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" // z élevé
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
                        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                        className="fixed top-0 left-0 h-full w-64 bg-background text-foreground border-r border-border shadow-xl z-[70]"
                    >
                        <Sidebar onLinkClick={onClose} />
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    )
}
