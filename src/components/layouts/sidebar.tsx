'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CreditCard, Users, BookOpen, CheckCircle, Settings, X, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useAuthStore } from '@/features/auth'
import { UserRole } from '@/types/user'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function Sidebar({
    onLinkClick,
    collapsed = false,
    onToggleCollapse,
}: {
    onLinkClick?: () => void
    collapsed?: boolean
    onToggleCollapse?: () => void
}) {
    const pathname = usePathname()
    const { user } = useAuthStore()

    /** -------------------------------
     * 🎓 Menu de base (abonné)
     * ------------------------------- */
    const baseMenu = [
        { label: 'Dashboard', href: '/dashboard', icon: Home },
        { label: 'Ma carte', href: '/dashboard/subscriber/card', icon: CreditCard },
    ]

    /** -------------------------------
     * 👨‍💼 Menu du manager
     * ------------------------------- */
    const managerMenu = [
        { label: 'Tableau de bord', href: '/dashboard/manager', icon: Home },
        { label: 'Paiements', href: '/dashboard/manager/payments', icon: CheckCircle },
        { label: 'Abonnements', href: '/dashboard/manager/subscriptions', icon: BookOpen },
        { label: 'Utilisateurs', href: '/dashboard/manager/users', icon: Users },
    ]

    /** -------------------------------
     * 🛠️ Menu de l’administrateur
     * ------------------------------- */
    const adminMenu = [
        { label: 'Dashboard', href: '/dashboard', icon: Home },
        { label: 'Utilisateurs', href: '/dashboard/admin/users', icon: Users },
        { label: 'Rapports', href: '/dashboard/admin/reports', icon: BookOpen },
        { label: 'Paramètres', href: '/dashboard/admin/settings', icon: Settings },
    ]

    /** -------------------------------
     * 📋 Attribution selon le rôle
     * ------------------------------- */
    let menu = baseMenu
    if (user?.role === UserRole.MANAGER || user?.role === UserRole.MANAGER_VIEWER) {
        menu = managerMenu
    } else if (user?.role === UserRole.ADMIN) {
        menu = adminMenu
    }

    return (
        <aside
            className={`flex flex-col bg-surface border-r border-border h-screen fixed top-0 left-0 z-[70] shadow-card transition-all duration-300 ${
                collapsed ? 'w-16' : 'w-64'
            }`}
        >
            {/* ======= En-tête du menu ======= */}
            <div className="flex items-center justify-between gap-2 h-16 border-b border-border bg-surface shadow-sm px-3">
                <div className={`flex items-center gap-2 ${collapsed ? 'justify-center w-full' : ''}`}>
                    <Image
                        src="/logo.png"
                        width={collapsed ? 28 : 36}
                        height={collapsed ? 28 : 36}
                        alt="UPN Logo"
                        className=""
                    />
                    {!collapsed && (
                        <span className="text-primary font-bold text-lg tracking-tight">
                            eBibliothèque
                        </span>
                    )}
                </div>

                {/* Bouton animé pour fermer sur mobile */}
                <motion.div
                    initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.4, type: 'spring', stiffness: 180, damping: 15 }}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden text-text hover:text-primary transition-transform hover:rotate-90"
                        onClick={onLinkClick}
                        aria-label="Fermer le menu"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </motion.div>
                {/* Toggle collapse (desktop) */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden lg:flex text-text hover:text-primary"
                    onClick={onToggleCollapse}
                    aria-label={collapsed ? 'Étendre le menu' : 'Réduire le menu'}
                >
                    {collapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
                </Button>
            </div>

            {/* ======= Navigation ======= */}
            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
                {menu.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname.startsWith(href)
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onLinkClick}
                            className={`flex items-center gap-3 px-3 py-2 mx-2 transition-all duration-150 ${
                                isActive
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'text-text hover:bg-primary/5 hover:text-primary'
                            }`}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            {!collapsed && <span className="truncate">{label}</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* ======= Bas du menu ======= */}
            <div className="border-t border-border bg-surface p-4 text-sm text-text-secondary flex items-center gap-2 hover:text-primary cursor-pointer transition-colors">
                <Settings className="w-4 h-4" />
                {!collapsed && 'Mon profil'}
            </div>
        </aside>
    )
}
