'use client'

import { useAuthStore } from '@/features/auth'
import { useLogout } from '@/features/auth'
import { Bell, Menu, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { UserRole } from '@/types/user'

type HeaderProps = {
    onMenuClick?: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
    const { user } = useAuthStore()
    const logoutMutation = useLogout()

    /** Traduction du rôle utilisateur */
    const roleLabel =
        user?.role === UserRole.ADMIN
            ? 'Administrateur'
            : user?.role === UserRole.MANAGER
            ? 'Manager'
            : user?.role === UserRole.MANAGER_VIEWER
            ? 'Manager (Vue)'
            : 'Abonné'

    return (
        <header className="sticky top-0 z-40 flex items-center justify-between bg-surface/80 backdrop-blur-md border-b border-border h-16 px-4 shadow-card transition-colors duration-300">
            {/* Bouton menu mobile */}
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-primary/10 text-primary"
                onClick={onMenuClick}
                aria-label="Ouvrir le menu"
            >
                <Menu className="w-5 h-5" />
            </Button>

            {/* Titre principal */}
            <div className="flex flex-col leading-tight">
                <h1 className="text-lg font-semibold text-primary">Bibliothèque UPN</h1>
                {user && (
                    <span className="text-xs text-text-secondary">
                        {user.firstName} {user.lastName} · {roleLabel}
                    </span>
                )}
            </div>

            {/* Notifications + Profil */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:text-primary transition-colors"
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-danger text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center shadow-button">
                        2
                    </span>
                </Button>

                {/* Profil utilisateur */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 hover:text-primary"
                        >
                            <div className="relative">
                                <Avatar className="w-8 h-8 bg-primary/10">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        <User className="w-4 h-4" />
                                    </AvatarFallback>
                                </Avatar>

                                {/* Indicateur en ligne */}
                                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-success ring-2 ring-surface animate-blink" />
                            </div>
                        </Button>
                    </DropdownMenuTrigger>

                    {/* Menu déroulant */}
                    <DropdownMenuContent className="w-48" align="end" sideOffset={6}>
                        <DropdownMenuLabel className="text-sm text-text font-medium">
                            Mon compte
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-text hover:text-primary">
                            Profil
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-text hover:text-primary">
                            Paramètres
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => logoutMutation.mutate()}
                            disabled={logoutMutation.isPending}
                            className="text-danger hover:text-danger/80 flex items-center"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            {logoutMutation.isPending ? 'Déconnexion…' : 'Se déconnecter'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
