'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
    const [escuro, setEscuro] = useState(false)

    useEffect(() => {
        setEscuro(document.documentElement.classList.contains('dark'))
    }, [])

    function alternar() {
        const proximo = !escuro
        setEscuro(proximo)
        document.documentElement.classList.toggle('dark', proximo)
        localStorage.setItem('theme', proximo ? 'dark' : 'light')
    }

    return (
        <button
            type="button"
            onClick={alternar}
            title={escuro ? 'Ativar modo claro' : 'Ativar modo escuro'}
            aria-label={escuro ? 'Ativar modo claro' : 'Ativar modo escuro'}
            className={cn(
                'inline-flex shrink-0 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                compact ? 'justify-center p-2' : 'px-3 py-2'
            )}
        >
            {escuro ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
            {!compact && (escuro ? 'Modo claro' : 'Modo escuro')}
        </button>
    )
}
