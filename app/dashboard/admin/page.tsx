'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { theme } from '@/constants/theme'
import { BarChart, Users, CreditCard, Activity, Plus } from 'lucide-react'
import { BarChart as Chart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

/* ---------------------------------------------
 * Données simulées pour le graphique
 * --------------------------------------------- */
const data = [
    { month: 'Jan', subscriptions: 30 },
    { month: 'Feb', subscriptions: 45 },
    { month: 'Mar', subscriptions: 60 },
    { month: 'Apr', subscriptions: 55 },
    { month: 'May', subscriptions: 70 },
    { month: 'Jun', subscriptions: 90 },
]

/* ---------------------------------------------
 * Composant principal
 * --------------------------------------------- */
export default function AdminDashboardPage() {
    return (
        <section className="space-y-8">
            {/* 🔹 Titre */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-primary">
                        Admin Dashboard — Overview
                    </h1>
                    <p className="text-sm text-text-secondary">
                        Overview of users, subscriptions, and system activity
                    </p>
                </div>
                <Button
                    className="flex items-center gap-2"
                    style={{
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.surface,
                    }}
                >
                    <Plus className="w-4 h-4" />
                    Add Manager
                </Button>
            </div>

            {/* 🔹 Cartes de statistiques */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Users */}
                <Card className="shadow-card border-border bg-surface">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-sm text-text-secondary">Total Users</CardTitle>
                        <Users className="text-primary w-5 h-5" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-text">1,248</p>
                        <p className="text-xs text-text-secondary">+12 this week</p>
                    </CardContent>
                </Card>

                {/* Active Subscriptions */}
                <Card className="shadow-card border-border bg-surface">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-sm text-text-secondary">
                            Active Subscriptions
                        </CardTitle>
                        <Activity className="text-success w-5 h-5" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-text">982</p>
                        <p className="text-xs text-text-secondary">↑ 8% since last month</p>
                    </CardContent>
                </Card>

                {/* Pending Vouchers */}
                <Card className="shadow-card border-border bg-surface">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-sm text-text-secondary">
                            Pending Vouchers
                        </CardTitle>
                        <CreditCard className="text-warning w-5 h-5" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-text">74</p>
                        <p className="text-xs text-text-secondary">3 awaiting approval</p>
                    </CardContent>
                </Card>

                {/* Total Revenue */}
                <Card className="shadow-card border-border bg-surface">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-sm text-text-secondary">Total Revenue</CardTitle>
                        <BarChart className="text-secondary w-5 h-5" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-text">$12,340</p>
                        <p className="text-xs text-text-secondary">+24% this month</p>
                    </CardContent>
                </Card>
            </div>

            {/* 🔹 Graphique des abonnements */}
            <Card className="shadow-card border-border bg-surface">
                <CardHeader>
                    <CardTitle className="text-text">Monthly Subscriptions</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <Chart data={data}>
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
                    <CardTitle className="text-text">Recent Users</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead className="text-left border-b border-border">
                            <tr>
                                <th className="py-2 px-4 text-text-secondary">Name</th>
                                <th className="py-2 px-4 text-text-secondary">Role</th>
                                <th className="py-2 px-4 text-text-secondary">Status</th>
                                <th className="py-2 px-4 text-text-secondary">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-border hover:bg-background/40">
                                <td className="py-2 px-4">Sarah Mwamba</td>
                                <td className="py-2 px-4 capitalize">Manager</td>
                                <td className="py-2 px-4 text-success font-medium">Active</td>
                                <td className="py-2 px-4 text-text-secondary">Oct 15, 2025</td>
                            </tr>
                            <tr className="border-b border-border hover:bg-background/40">
                                <td className="py-2 px-4">John Doe</td>
                                <td className="py-2 px-4 capitalize">Manager Viewer</td>
                                <td className="py-2 px-4 text-danger font-medium">Blocked</td>
                                <td className="py-2 px-4 text-text-secondary">Oct 10, 2025</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </section>
    )
}
