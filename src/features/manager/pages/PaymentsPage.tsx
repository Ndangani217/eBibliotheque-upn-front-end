'use client'

import { motion } from 'framer-motion'
import { PaymentTabs } from '../components/payments/paymentTabs'

export default function PaymentsPage() {
    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 space-y-6"
        >
            {/* === Contenu === */}
            <section className="bg-card border border-border rounded-xl shadow-sm p-4 md:p-6">
                <PaymentTabs />
            </section>
        </motion.main>
    )
}
