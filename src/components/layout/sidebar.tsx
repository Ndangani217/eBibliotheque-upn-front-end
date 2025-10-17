'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Bell, BookOpen, CreditCard, Users, BarChart, Settings, Printer } from 'lucide-react'
import { useAuthStore } from '@/features/auth/store'
import { UserRole } from '@/types/user'
import Image from 'next/image'

export default function Sidebar({ onLinkClick }: { onLinkClick?: () => void }) {
    const pathname = usePathname()
    const { user } = useAuthStore()

    /**
     * Base menu (accessible à tous les rôles)
     */
    const baseMenu = [
        { label: 'Dashboard', href: '/dashboard', icon: Home },
        { label: 'Subscriptions', href: '/subscriptions', icon: BookOpen },
        { label: 'Payments', href: '/payments', icon: CreditCard },
        { label: 'Notifications', href: '/notifications', icon: Bell },
    ]

    /**
     * Menus spécifiques par rôle
     */
    const managerExtra = [{ label: 'Cards', href: '/manager/cards', icon: Printer }]
    const managerViewerExtra = [
        { label: 'Cards (View)', href: '/manager/cards/view', icon: Printer },
    ]
    const adminExtra = [
        { label: 'Users', href: '/admin/users', icon: Users },
        { label: 'Reports', href: '/admin/reports', icon: BarChart },
        { label: 'Settings', href: '/admin/settings', icon: Settings },
    ]

    /**
     * Construction dynamique selon le rôle utilisateur
     */
    let menu = baseMenu
    switch (user?.role) {
        case UserRole.MANAGER:
            menu = [...baseMenu, ...managerExtra]
            break
        case UserRole.MANAGER_VIEWER:
            menu = [...baseMenu, ...managerViewerExtra]
            break
        case UserRole.ADMIN:
            menu = [...baseMenu, ...adminExtra]
            break
        case UserRole.SUBSCRIBER:
        default:
            menu = baseMenu
    }

    /**
     * Rendu du composant Sidebar
     */
    return (
        <aside className="hidden lg:flex flex-col bg-surface border-r border-border h-screen w-64 fixed top-0 left-0 z-40 shadow-card transition-colors duration-300">
            {/* Logo et titre */}
            <div className="flex items-center justify-center gap-2 h-16 border-b border-border bg-surface shadow-sm">
                <Image
                    src="/logo.png"
                    width={40}
                    height={40}
                    alt="UPN Logo"
                    className="rounded-full"
                />
                <span className="text-primary font-bold text-lg tracking-tight">UPN Library</span>
            </div>

            {/* Navigation principale */}
            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
                {menu.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname.startsWith(href)
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onLinkClick}
                            className={`flex items-center gap-3 px-4 py-2 rounded-md mx-2 transition-all duration-150 ${
                                isActive
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'text-text hover:bg-primary/5 hover:text-primary'
                            }`}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            <span className="truncate">{label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Pied de sidebar */}
            <div className="border-t border-border bg-surface p-4 text-sm text-text-secondary flex items-center gap-2 hover:text-primary cursor-pointer transition-colors">
                <Settings className="w-4 h-4" />
                My Profile
            </div>
        </aside>
    )
}
