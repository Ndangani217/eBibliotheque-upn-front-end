'use client'
import { useEffect, useState } from 'react'

export function useIsDesktop(minWidth = 768) {
    const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

    useEffect(() => {
        const updateMatch = () => {
            setIsDesktop(window.innerWidth >= minWidth)
        }

        updateMatch()
        window.addEventListener('resize', updateMatch)
        return () => window.removeEventListener('resize', updateMatch)
    }, [minWidth])

    return isDesktop
}
