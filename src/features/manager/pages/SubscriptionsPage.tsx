'use client'

import { SubscriptionTabs } from '@/features/manager/components/subscriptions/SubscriptionTabs'
import { Loader2, AlertTriangle, Search } from 'lucide-react'
import { useState } from 'react'

/**
 * Page de gestion des abonnements
 * - Recherche
 * - Pagination
 * - Onglets (valide / expiré / suspendu)
 */
import { motion } from 'framer-motion'
export default function SubscriptionPage() {
    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 space-y-6"
        >
            {/* === Contenu === */}
            <section className="bg-card border border-border rounded-xl shadow-sm p-4 md:p-6">
                <SubscriptionTabs />
            </section>
        </motion.main>
    )
}
