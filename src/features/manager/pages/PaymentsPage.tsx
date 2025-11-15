'use client'

import { motion } from 'framer-motion'
import { PaymentTabs } from '../components/payments/PaymentTabs'

export default function PaymentsPage() {
    return (
		<motion.section
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="space-y-6"
		>
			<div className="border border-border bg-surface p-4 md:p-6">
				<PaymentTabs />
			</div>
		</motion.section>
    )
}
