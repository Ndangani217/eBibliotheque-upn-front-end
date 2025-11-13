'use client'

import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, CreditCard, CheckCircle, XCircle, Users, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/features/auth'
import api from '@/services/api'
import { theme } from '@/constants/theme'

export default function ManagerDashboardPage() {
    const { user } = useAuthStore()

    /** 🔹 Récupération des statistiques du manager */
    const { data, isLoading, isError } = useQuery({
        queryKey: ['manager-stats'],
        queryFn: async () => {
            const res = await api.get('/manager/dashboard')
            return res.data.data
        },
    })

    const stats = data || {
        totalSubscribers: 0,
        activeSubscriptions: 0,
        expiredSubscriptions: 0,
        pendingPayments: 0,
        validatedPayments: 0,
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-danger">
                <XCircle className="w-10 h-10 mb-2" />
                <p>Impossible de charger les données du tableau de bord.</p>
            </div>
        )
    }

    return (
        <section className="space-y-8">
            {/* ===== Titre principal ===== */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-primary">
                        Tableau de bord du Manager
                    </h1>
                    <p className="text-sm text-text-secondary">
                        Bonjour <strong>{user?.firstName}</strong>, voici le résumé de vos
                        activités.
                    </p>
                </div>
            </header>

            {/* ===== Cartes de statistiques ===== */}
            {isLoading ? (
                <div className="text-center py-20 text-text-secondary">Chargement...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            title: 'Abonnés inscrits',
                            value: stats.totalSubscribers,
                            icon: Users,
                            color: theme.colors.primary,
                        },
                        {
                            title: 'Abonnements actifs',
                            value: stats.activeSubscriptions,
                            icon: CheckCircle,
                            color: theme.colors.success,
                        },
                        {
                            title: 'Abonnements expirés',
                            value: stats.expiredSubscriptions,
                            icon: XCircle,
                            color: theme.colors.danger,
                        },
                        {
                            title: 'Paiements validés',
                            value: stats.validatedPayments,
                            icon: CreditCard,
                            color: theme.colors.primary,
                        },
                        {
                            title: 'Paiements en attente',
                            value: stats.pendingPayments,
                            icon: Clock,
                            color: theme.colors.warning,
                        },
                        {
                            title: 'Cartes générées',
                            value: stats.activeSubscriptions + stats.expiredSubscriptions,
                            icon: BookOpen,
                            color: theme.colors.info,
                        },
                    ].map(({ title, value, icon: Icon, color }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="flex items-center justify-between">
                                    <CardTitle className="text-base font-medium text-text-secondary">
                                        {title}
                                    </CardTitle>
                                    <Icon className="w-6 h-6" style={{ color }} />
                                </CardHeader>
                                <CardContent>
                                    <p
                                        className="text-3xl font-bold"
                                        style={{ color: color ?? theme.colors.primary }}
                                    >
                                        {value}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* ===== Section analytique ===== */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10"
            >
                <Card className="shadow-card border-border">
                    <CardHeader>
                        <CardTitle>Tendance des abonnements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-text-secondary">
                            (Graphique à venir) — courbe mensuelle des abonnements actifs vs
                            expirés.
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-card border-border">
                    <CardHeader>
                        <CardTitle>Activité des paiements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-text-secondary">
                            (Graphique à venir) — évolution des paiements validés et en attente.
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </section>
    )
}
