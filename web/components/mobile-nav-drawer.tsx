'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { APP_VERSION } from '@/shared/constants/versao'

interface NavItem {
    href: string
    label: string
    icon: LucideIcon
}

interface MobileNavDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    navItems: NavItem[]
    nomeUsuario: string
}

export function MobileNavDrawer({ open, onOpenChange, navItems, nomeUsuario }: MobileNavDrawerProps) {
    const pathname = usePathname()

    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay
                    className={cn(
                        'fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]',
                        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
                    )}
                />
                <DialogPrimitive.Content
                    className={cn(
                        'fixed inset-y-0 left-0 z-50 flex h-full w-72 max-w-[80vw] flex-col border-r border-border bg-card',
                        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left duration-200'
                    )}
                >
                    <DialogPrimitive.Title className="sr-only">Menu de navegação</DialogPrimitive.Title>
                    <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="Safeloc"
                                width={36}
                                height={36}
                                className="h-9 w-9 rounded-lg"
                            />
                            <p className="text-sm font-bold tracking-tight">
                                Safe<span className="text-primary">loc</span>
                            </p>
                        </div>
                        <DialogPrimitive.Close
                            aria-label="Fechar menu"
                            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <X className="h-4 w-4" />
                        </DialogPrimitive.Close>
                    </div>

                    <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const ativo = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => onOpenChange(false)}
                                    className={cn(
                                        'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
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

                    <div className="shrink-0 border-t border-border px-4 py-4 text-center">
                        <p className="truncate text-sm font-medium text-foreground">{nomeUsuario}</p>
                        <p className="mt-1.5 text-xs text-muted-foreground">v{APP_VERSION}</p>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
}
