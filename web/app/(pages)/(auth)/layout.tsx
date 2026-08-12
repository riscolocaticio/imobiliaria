'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, PlusCircle, Trash2, Users, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUser } from '@/app/providers/user-provider'
import { authService } from '@/app/services/auth.service'
import { ROUTES } from '@/shared/enums/routes.enum'

const NAV_ITEMS = [
    { href: ROUTES.CONSULTAR, label: 'Consultar informações', icon: Search },
    { href: ROUTES.INSERIR, label: 'Inserir informações', icon: PlusCircle },
    { href: ROUTES.EXCLUIR, label: 'Excluir informações', icon: Trash2 },
    { href: ROUTES.USUARIOS, label: 'Usuários', icon: Users }
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { usuario, carregando } = useUser()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!carregando && !usuario) {
            router.replace(`${ROUTES.LOGIN}?returnTo=${encodeURIComponent(pathname)}`)
        }
    }, [carregando, usuario, pathname, router])

    if (carregando || !usuario) {
        return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Carregando...</div>
    }

    return (
        <div className="min-h-screen">
            <header className="border-b border-border bg-card">
                <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold">Plataforma de Risco Locatício</p>
                        <p className="text-xs text-muted-foreground">{usuario.nomeCompleto}</p>
                    </div>

                    <nav className="flex flex-wrap gap-2">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon
                            const ativo = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                        ativo
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            )
                        })}
                        <button
                            onClick={() => {
                                authService.logout()
                                window.location.href = ROUTES.LOGIN
                            }}
                            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <LogOut className="h-4 w-4" />
                            Sair
                        </button>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </div>
    )
}
