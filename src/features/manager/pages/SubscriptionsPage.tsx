'use client'

import { SubscriptionTabs } from '@/features/manager/components/subscriptions/SubscriptionTabs'
import { motion } from 'framer-motion'

/**
 * Page de gestion des abonnements
 * - Recherche
 * - Pagination
 * - Onglets (valide / expiré / suspendu)
 */
export default function SubscriptionsPage() {
    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 space-y-6"
        >
            {/* === Contenu === */}
            <section className="bg-card border border-border rounded-[9px] shadow-sm p-4 md:p-6">
                <SubscriptionTabs />
            </section>
        </motion.main>
    )
}
