import { useEffect, useState } from 'react'

const DELAY_PADRAO_MS = 300

export function useDelayedLoading(isLoading: boolean, delayMs = DELAY_PADRAO_MS): boolean {
    const [mostrar, setMostrar] = useState(false)

    useEffect(() => {
        if (!isLoading) {
            setMostrar(false)
            return
        }

        const timer = setTimeout(() => setMostrar(true), delayMs)
        return () => clearTimeout(timer)
    }, [isLoading, delayMs])

    return mostrar
}
