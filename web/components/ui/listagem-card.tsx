'use client'

import { Loader2, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from './button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Skeleton } from './skeleton'

const SKELETON_LINHAS = [1, 2, 3, 4]

const ListagemCardSkeletonItem = () => (
    <div className="flex flex-col gap-3 rounded-md border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-52" />
            </div>
        </div>
        <div className="flex shrink-0 gap-2">
            <Skeleton className="h-9 w-16 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
        </div>
    </div>
)

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
        <Card className="flex min-h-full flex-col md:h-full md:min-h-0 md:overflow-hidden">
            <CardHeader className="shrink-0 flex-row flex-wrap items-center justify-between gap-4 space-y-0">
                <div>
                    <CardTitle>{title}</CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </div>
                {headerActions && (
                    <div className="grid w-full grid-cols-2 gap-2 [&>*:only-child]:col-span-2 md:flex md:w-auto md:flex-wrap md:items-center">
                        {headerActions}
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3 md:min-h-0">
                {isLoading && (
                    <div className="flex flex-1 flex-col gap-3 md:min-h-0 md:overflow-y-auto">
                        {SKELETON_LINHAS.map((linha) => (
                            <ListagemCardSkeletonItem key={linha} />
                        ))}
                    </div>
                )}

                {!isLoading && isEmpty && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-6 md:min-h-0">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                            <EmptyIcon className="h-7 w-7 text-muted-foreground" />
                        </span>
                        <p className="max-w-xs text-center text-sm text-muted-foreground">{emptyMessage}</p>
                    </div>
                )}

                {!isLoading && !isEmpty && (
                    <div className="flex-1 md:min-h-0 md:overflow-y-auto">
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
