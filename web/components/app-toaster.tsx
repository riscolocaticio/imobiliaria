'use client'

import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'

export function AppToaster() {
    const [tema, setTema] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        const atualizar = () =>
            setTema(document.documentElement.classList.contains('dark') ? 'dark' : 'light')

        atualizar()

        const observer = new MutationObserver(atualizar)
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
        return () => observer.disconnect()
    }, [])

    return <Toaster position="bottom-center" theme={tema} richColors closeButton />
}
