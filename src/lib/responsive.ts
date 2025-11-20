/**
 * Utilitaires responsive - Mobile-first
 * Helpers pour gérer les breakpoints et les layouts responsive
 */

import { useEffect, useState } from 'react'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export const breakpoints: Record<Breakpoint, number> = {
    xs: 0,
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
}

/**
 * Hook pour détecter le breakpoint actuel
 */
export function useBreakpoint(): Breakpoint {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>('xs')

    useEffect(() => {
        const updateBreakpoint = () => {
            const width = window.innerWidth
            if (width >= breakpoints['2xl']) {
                setBreakpoint('2xl')
            } else if (width >= breakpoints.xl) {
                setBreakpoint('xl')
            } else if (width >= breakpoints.lg) {
                setBreakpoint('lg')
            } else if (width >= breakpoints.md) {
                setBreakpoint('md')
            } else if (width >= breakpoints.sm) {
                setBreakpoint('sm')
            } else {
                setBreakpoint('xs')
            }
        }

        updateBreakpoint()
        window.addEventListener('resize', updateBreakpoint)
        return () => window.removeEventListener('resize', updateBreakpoint)
    }, [])

    return breakpoint
}

/**
 * Hook pour vérifier si on est sur mobile
 */
export function useIsMobile(): boolean {
    const breakpoint = useBreakpoint()
    return breakpoint === 'xs' || breakpoint === 'sm'
}

/**
 * Hook pour vérifier si on est sur tablette
 */
export function useIsTablet(): boolean {
    const breakpoint = useBreakpoint()
    return breakpoint === 'md'
}

/**
 * Hook pour vérifier si on est sur desktop
 */
export function useIsDesktop(): boolean {
    const breakpoint = useBreakpoint()
    return breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl'
}

/**
 * Hook pour obtenir la largeur de l'écran
 */
export function useWindowWidth(): number {
    const [width, setWidth] = useState(0)

    useEffect(() => {
        const updateWidth = () => setWidth(window.innerWidth)
        updateWidth()
        window.addEventListener('resize', updateWidth)
        return () => window.removeEventListener('resize', updateWidth)
    }, [])

    return width
}

/**
 * Classes Tailwind responsive communes
 */
export const responsiveClasses = {
    container: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    grid: {
        mobile: 'grid grid-cols-1 gap-4',
        tablet: 'sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6',
        desktop: 'lg:grid-cols-4 xl:grid-cols-5 gap-6',
    },
    text: {
        mobile: 'text-sm sm:text-base',
        heading: 'text-xl sm:text-2xl md:text-3xl',
        subheading: 'text-lg sm:text-xl md:text-2xl',
    },
    spacing: {
        mobile: 'p-4 sm:p-6',
        desktop: 'p-6 md:p-8 lg:p-10',
    },
}

