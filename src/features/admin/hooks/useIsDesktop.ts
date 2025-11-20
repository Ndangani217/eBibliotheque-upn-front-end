'use client'
import { useState, useEffect } from 'react'

export function useIsDesktop(minWidth = 768) {
    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined') return

        const handleResize = () => {
            setIsDesktop(window.innerWidth >= minWidth)
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [minWidth])

    return isDesktop
}
