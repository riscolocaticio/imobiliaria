'use client'

import { Loader2, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from './button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'

export interface ListagemCardPaginacao {
    page: number
    totalPaginas: number
    onAnterior: () => void
    onProxima: () => void
    mostrarCarregando: boolean
    ultimaAcao: string | null
}

export interface ListagemCardProps {
    title: string
    description?: string
    headerActions?: ReactNode
    isLoading?: boolean
    isEmpty?: boolean
    emptyIcon: LucideIcon
    emptyMessage: string
    pagination?: ListagemCardPaginacao
    children: ReactNode
}

const ListagemCard = ({
    title,
    description,
    headerActions,
    isLoading,
    isEmpty,
    emptyIcon: EmptyIcon,
    emptyMessage,
    pagination,
    children
}: ListagemCardProps) => {
    return (
        <Card className="flex h-full min-h-0 flex-col overflow-hidden">
            <CardHeader className="shrink-0 flex-row flex-wrap items-center justify-between gap-4 space-y-0">
                <div>
                    <CardTitle>{title}</CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </div>
                {headerActions && <div className="flex flex-wrap items-center gap-2">{headerActions}</div>}
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
                {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}

                {!isLoading && isEmpty && (
                    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                            <EmptyIcon className="h-7 w-7 text-muted-foreground" />
                        </span>
                        <p className="max-w-xs text-center text-sm text-muted-foreground">{emptyMessage}</p>
                    </div>
                )}

                {!isLoading && !isEmpty && (
                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <div className="flex flex-col gap-3 pb-4">{children}</div>
                    </div>
                )}

                {pagination && pagination.totalPaginas > 1 && (
                    <div className="flex shrink-0 items-center justify-between border-t border-border pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page <= 1 || pagination.mostrarCarregando}
                            onClick={pagination.onAnterior}
                        >
                            {pagination.mostrarCarregando && pagination.ultimaAcao === 'anterior' && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            Anterior
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            Página {pagination.page} de {pagination.totalPaginas}
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page >= pagination.totalPaginas || pagination.mostrarCarregando}
                            onClick={pagination.onProxima}
                        >
                            {pagination.mostrarCarregando && pagination.ultimaAcao === 'proxima' && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            Próxima
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export { ListagemCard }
