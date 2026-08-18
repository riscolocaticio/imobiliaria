'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Search, PlusCircle, Trash2, Users, MessageSquareWarning, ShieldCheck, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppFooter } from '@/components/app-footer'
import { AppLoading } from '@/components/app-loading'
import { MobileNavDrawer } from '@/components/mobile-nav-drawer'
import { NotificacaoSino } from '@/components/notificacao-sino'
import { TermoAceiteGate } from '@/components/termo-aceite-gate'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useUser } from '@/app/providers/user-provider'
import { authService } from '@/app/services/auth.service'
import { APP_VERSION } from '@/shared/constants/versao'
import { ROUTES } from '@/shared/enums/routes.enum'

const NAV_ITEMS = [
    { href: ROUTES.CONSULTAR, label: 'Consultar Ocorrências', icon: Search },
    { href: ROUTES.INSERIR, label: 'Inserir Ocorrências', icon: PlusCircle },
    { href: ROUTES.EXCLUIR, label: 'Excluir Ocorrências', icon: Trash2 },
    { href: ROUTES.USUARIOS, label: 'Usuários', icon: Users },
    { href: ROUTES.CONTESTACAO, label: 'Contestação', icon: MessageSquareWarning }
]

function getSaudacao() {
    const minutosDoDia = new Date().getHours() * 60 + new Date().getMinutes()

    if (minutosDoDia < 4 * 60 + 30 || minutosDoDia >= 18 * 60) return 'Boa noite'
    if (minutosDoDia < 12 * 60) return 'Bom dia'
    return 'Boa tarde'
}

const ADMIN_NAV_ITEM = {
    href: ROUTES.ADMINISTRADOR,
    label: 'Administrador',
    icon: ShieldCheck
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { usuario, carregando } = useUser()
    const router = useRouter()
    const pathname = usePathname()
    const [menuAberto, setMenuAberto] = useState(false)

    useEffect(() => {
        if (!carregando && !usuario) {
            router.replace(`${ROUTES.LOGIN}?returnTo=${encodeURIComponent(pathname)}`)
        }
    }, [carregando, usuario, pathname, router])

    useEffect(() => {
        setMenuAberto(false)
    }, [pathname])

    if (carregando || !usuario) {
        return <AppLoading />
    }

    if (!usuario.termoAceito) {
        return <TermoAceiteGate />
    }

    async function sair() {
        await authService.logout()
        window.location.href = ROUTES.LOGIN
    }

    const navItems = usuario.role === 'MASTER' ? [...NAV_ITEMS, ADMIN_NAV_ITEM] : NAV_ITEMS

    return (
        <div className="flex min-h-dvh md:h-dvh md:overflow-hidden">
            <aside className="hidden shrink-0 flex-col border-r border-border bg-card md:flex md:w-64">
                <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
                    <Image src="/logo.png" alt="Safeloc" width={36} height={36} className="h-9 w-9 rounded-lg" />
                    <p className="text-sm font-bold tracking-tight">
                        Safe<span className="text-primary">loc</span>
                    </p>
                </div>

                <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const ativo = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    ativo
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="shrink-0 border-t border-border px-4 py-3 text-center">
                    <p className="text-xs leading-4 text-muted-foreground">v{APP_VERSION}</p>
                </div>
            </aside>

            <div className="flex w-full flex-1 flex-col md:min-h-0 md:overflow-hidden">
                <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => setMenuAberto(true)}
                        aria-label="Abrir menu"
                        className="inline-flex shrink-0 items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="flex min-w-0 flex-1 items-center gap-2 md:hidden">
                        <Image src="/logo.png" alt="Safeloc" width={32} height={32} className="h-8 w-8 rounded-lg" />
                        <p className="truncate text-sm font-bold tracking-tight">
                            Safe<span className="text-primary">loc</span>
                        </p>
                    </div>

                    <div className="hidden flex-1 md:block">
                        <p className="truncate text-base text-muted-foreground">
                            {getSaudacao()}, <span className="font-medium text-foreground">{usuario.nomeCompleto}</span>
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                        <NotificacaoSino />
                        <ThemeToggle compact />
                        <button
                            onClick={sair}
                            title="Sair"
                            aria-label="Sair"
                            className="inline-flex shrink-0 items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </header>

                <main className="flex w-full flex-1 flex-col px-4 pt-6 sm:px-6 sm:pt-8 md:min-h-0 md:overflow-y-auto lg:px-8">
                    <div className="flex-1 pb-6">{children}</div>
                    <AppFooter />
                </main>
            </div>

            <MobileNavDrawer
                open={menuAberto}
                onOpenChange={setMenuAberto}
                navItems={navItems}
                nomeUsuario={usuario.nomeCompleto}
            />
        </div>
    )
}
