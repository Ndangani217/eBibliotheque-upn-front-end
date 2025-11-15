'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { theme } from '@/constants/theme'
import { BarChart, Users, CreditCard, Activity, Plus } from 'lucide-react'
import { BarChart as Chart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { useUserStats, useVerifiedUsers } from '@/hooks/useUsers'
import { formatDate } from '@/utils/date'
import CreateManagerModal from '@/features/admin/components/CreateManagerModal'
import { useState } from 'react'

/* Données du graphique (placeholder si pas d'API dédiée encore) */
const placeholderChart = [
	{ month: 'Jan', subscriptions: 0 },
	{ month: 'Feb', subscriptions: 0 },
	{ month: 'Mar', subscriptions: 0 },
	{ month: 'Apr', subscriptions: 0 },
	{ month: 'May', subscriptions: 0 },
	{ month: 'Jun', subscriptions: 0 },
]

/* ---------------------------------------------
 * Composant principal
 * --------------------------------------------- */
export default function AdminDashboardPage() {
	const [showAddModal, setShowAddModal] = useState(false)
	/** Statistiques Utilisateurs (API: GET /users/stats) */
	const { data: userStats } = useUserStats()

	/** Statistiques globales (réutilisation de l'endpoint manager pour abonnements/paiements) */
	const { data: managerStats } = useQuery({
		queryKey: ['admin-dashboard-manager-stats'],
		queryFn: async () => {
			const res = await api.get('/manager/dashboard')
			return res.data?.data ?? {
				activeSubscriptions: 0,
				expiredSubscriptions: 0,
				validatedPayments: 0,
				pendingPayments: 0,
				totalSubscribers: 0,
			}
		},
		staleTime: 1000 * 60 * 5,
	})

	/** Derniers utilisateurs (page 1, 5 éléments) */
	const { data: recentUsers } = useVerifiedUsers('', 1, 5)

	const totalUsers = userStats?.total ?? 0
	const activeSubscriptions = managerStats?.activeSubscriptions ?? 0
	const pendingVouchers = managerStats?.pendingPayments ?? 0
	const validatedPayments = managerStats?.validatedPayments ?? 0

	return (
		<section className="space-y-6">
            {/* 🔹 Titre */}
            <div className="flex items-center justify-between">
                <div>
					<h1 className="text-2xl font-semibold text-primary">Tableau de bord — Admin</h1>
                    <p className="text-sm text-text-secondary">
						Statistiques des utilisateurs, abonnements et activité du système
                    </p>
                </div>
                <Button
					onClick={() => setShowAddModal(true)}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-surface font-medium rounded-[9px] py-2 shadow-button transition-all duration-200"
                >
                    <Plus className="w-4 h-4" />
					Ajouter un manager
                </Button>
            </div>

            {/* 🔹 Cartes de statistiques */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Users */}
                <Card className="shadow-card border-border bg-surface">
                    <CardHeader className="flex items-center justify-between">
						<CardTitle className="text-sm text-text-secondary">Utilisateurs (total)</CardTitle>
                        <Users className="text-primary w-5 h-5" />
                    </CardHeader>
                    <CardContent>
						<p className="text-2xl font-bold text-text">{totalUsers}</p>
						<p className="text-xs text-text-secondary">Comptes au total</p>
                    </CardContent>
                </Card>

                {/* Active Subscriptions */}
                <Card className="shadow-card border-border bg-surface">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-sm text-text-secondary">
							Abonnements actifs
                        </CardTitle>
                        <Activity className="text-success w-5 h-5" />
                    </CardHeader>
                    <CardContent>
						<p className="text-2xl font-bold text-text">{activeSubscriptions}</p>
						<p className="text-xs text-text-secondary">Abonnements actifs</p>
                    </CardContent>
                </Card>

                {/* Pending Vouchers */}
                <Card className="shadow-card border-border bg-surface">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-sm text-text-secondary">
							Bons en attente
                        </CardTitle>
                        <CreditCard className="text-warning w-5 h-5" />
                    </CardHeader>
                    <CardContent>
						<p className="text-2xl font-bold text-text">{pendingVouchers}</p>
						<p className="text-xs text-text-secondary">En attente de paiement</p>
                    </CardContent>
                </Card>

				{/* Validated Payments */}
                <Card className="shadow-card border-border bg-surface">
                    <CardHeader className="flex items-center justify-between">
						<CardTitle className="text-sm text-text-secondary">Paiements validés</CardTitle>
                        <BarChart className="text-secondary w-5 h-5" />
                    </CardHeader>
                    <CardContent>
						<p className="text-2xl font-bold text-text">{validatedPayments}</p>
						<p className="text-xs text-text-secondary">Payés et validés</p>
                    </CardContent>
                </Card>
            </div>

            {/* 🔹 Graphique des abonnements */}
            <Card className="shadow-card border-border bg-surface">
                <CardHeader>
					<CardTitle className="text-text">Abonnements mensuels</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
						<Chart data={placeholderChart}>
                            <XAxis dataKey="month" stroke={theme.colors.textSecondary} />
                            <YAxis stroke={theme.colors.textSecondary} />
                            <Tooltip />
                            <Bar
                                dataKey="subscriptions"
                                fill={theme.colors.primary}
                                radius={[6, 6, 0, 0]}
                            />
                        </Chart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 🔹 Tableau des derniers utilisateurs */}
            <Card className="shadow-card border-border bg-surface">
                <CardHeader>
					<CardTitle className="text-text">Utilisateurs récents</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead className="text-left border-b border-border">
                            <tr>
								<th className="py-2 px-4 text-text-secondary">Nom</th>
								<th className="py-2 px-4 text-text-secondary">Rôle</th>
								<th className="py-2 px-4 text-text-secondary">Statut</th>
								<th className="py-2 px-4 text-text-secondary">Inscription</th>
                            </tr>
                        </thead>
                        <tbody>
							{recentUsers?.data?.map((u) => {
								const roleLabels: Record<string, string> = {
									admin: 'Administrateur',
									manager: 'Gestionnaire',
									manager_viewer: 'Gestionnaire (vue seule)',
									subscriber: 'Abonné',
								}
								return (
								<tr key={u.id} className="border-b border-border hover:bg-background/40">
									<td className="py-2 px-4">{u.firstName} {u.lastName}</td>
									<td className="py-2 px-4">{roleLabels[u.role] ?? u.role}</td>
									<td className="py-2 px-4">
										<span className={u.isBlocked ? 'text-danger font-medium' : 'text-success font-medium'}>
											{u.isBlocked ? 'Bloqué' : 'Actif'}
										</span>
									</td>
									<td className="py-2 px-4 text-text-secondary">
										{formatDate(u.createdAt)}
									</td>
								</tr>
							)})}
							{(!recentUsers || recentUsers.data.length === 0) && (
								<tr>
									<td className="py-3 px-4 text-text-secondary" colSpan={4}>
										Aucun utilisateur récent.
									</td>
								</tr>
							)}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

			{/* Modal de création de manager (identique à la page Utilisateurs) */}
			<CreateManagerModal open={showAddModal} onClose={() => setShowAddModal(false)} />
        </section>
    )
}
