'use client'

import { CardTabs } from '../components/cards/cardTabs'
import { motion } from 'framer-motion'
import { CreditCard } from 'lucide-react'

export default function CardsPage() {
    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 space-y-6"
        >
            {/* === Contenu === */}
            <section className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6">
                <CardTabs />
            </section>
        </motion.main>
    )
}
