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
		<motion.section
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="space-y-6"
		>
			<div className="border border-border bg-surface p-4 md:p-6">
				<SubscriptionTabs />
			</div>
		</motion.section>
    )
}
