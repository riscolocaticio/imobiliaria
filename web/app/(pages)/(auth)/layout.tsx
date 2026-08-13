'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, PlusCircle, Trash2, Users, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useUser } from '@/app/providers/user-provider'
import { authService } from '@/app/services/auth.service'
import { ROUTES } from '@/shared/enums/routes.enum'

const NAV_ITEMS = [
    { href: ROUTES.CONSULTAR, label: 'Consultar informações', shortLabel: 'Consultar', icon: Search },
    { href: ROUTES.INSERIR, label: 'Inserir informações', shortLabel: 'Inserir', icon: PlusCircle },
    { href: ROUTES.EXCLUIR, label: 'Excluir informações', shortLabel: 'Excluir', icon: Trash2 },
    { href: ROUTES.USUARIOS, label: 'Usuários', shortLabel: 'Usuários', icon: Users }
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

    function sair() {
        authService.logout()
        window.location.href = ROUTES.LOGIN
    }

    return (
        <div className="min-h-screen">
            <header className="border-b border-border bg-card">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <div>
                        <p className="text-sm font-semibold">Plataforma de Risco Locatício</p>
                        <p className="text-xs text-muted-foreground">{usuario.nomeCompleto}</p>
                    </div>

                    <nav className="hidden flex-wrap items-center gap-2 md:flex">
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
                        <ThemeToggle />
                        <button
                            onClick={sair}
                            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <LogOut className="h-4 w-4" />
                            Sair
                        </button>
                    </nav>

                    <div className="flex items-center gap-1 md:hidden">
                        <ThemeToggle compact />
                        <button
                            onClick={sair}
                            aria-label="Sair"
                            className="inline-flex shrink-0 items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8 md:pb-8 lg:px-8">{children}</main>

            <nav
                className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card md:hidden"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon
                    const ativo = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors',
                                ativo ? 'text-primary' : 'text-muted-foreground'
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.shortLabel}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
