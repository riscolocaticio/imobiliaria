'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDelayedLoading } from '@/lib/use-delayed-loading'
import { imobiliariaService } from '@/app/services/imobiliaria.service'
import { ACAO_LOG_LABEL, logService } from '@/app/services/log.service'

const TODAS_IMOBILIARIAS = 'todas'
const TODAS_ACOES = 'todas'
const PAGE_SIZE = 20

export function LogsTab() {
    const [filtroImobiliaria, setFiltroImobiliaria] = useState(TODAS_IMOBILIARIAS)
    const [filtroAcao, setFiltroAcao] = useState(TODAS_ACOES)
    const [page, setPage] = useState(1)
    const [ultimaAcao, setUltimaAcao] = useState<'anterior' | 'proxima' | 'filtro' | null>(null)

    const { data: imobiliarias } = useQuery({
        queryKey: ['admin-imobiliarias'],
        queryFn: () => imobiliariaService.listar()
    })

    const { data: resultado, isLoading, isFetching } = useQuery({
        queryKey: ['admin-logs', filtroImobiliaria, filtroAcao, page],
        queryFn: () =>
            logService.listar({
                imobiliariaId:
                    filtroImobiliaria === TODAS_IMOBILIARIAS ? undefined : Number(filtroImobiliaria),
                acao: filtroAcao === TODAS_ACOES ? undefined : filtroAcao,
                page,
                pageSize: PAGE_SIZE
            }),
        placeholderData: keepPreviousData
    })

    const mostrarCarregando = useDelayedLoading(isFetching)
    const totalPaginas = resultado ? Math.max(1, Math.ceil(resultado.total / PAGE_SIZE)) : 1

    function aplicarFiltro(setter: (value: string) => void) {
        return (value: string) => {
            setUltimaAcao('filtro')
            setter(value)
            setPage(1)
        }
    }

    return (
        <Card className="flex h-full min-h-0 flex-col overflow-hidden">
            <CardHeader className="shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle>Logs de auditoria</CardTitle>
                    <CardDescription>{resultado?.total ?? 0} registro(s) no total</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                    <div className="flex flex-col gap-1.5">
                        <Label className="flex items-center gap-1.5">
                            Imobiliária
                            {mostrarCarregando && ultimaAcao === 'filtro' && (
                                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                            )}
                        </Label>
                        <Select
                            value={filtroImobiliaria}
                            onValueChange={aplicarFiltro(setFiltroImobiliaria)}
                            disabled={mostrarCarregando}
                        >
                            <SelectTrigger className="w-52">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={TODAS_IMOBILIARIAS}>Todas</SelectItem>
                                {imobiliarias?.map((imobiliaria) => (
                                    <SelectItem key={imobiliaria.id} value={String(imobiliaria.id)}>
                                        {imobiliaria.nomeFantasia ?? imobiliaria.razaoSocial}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label>Ação</Label>
                        <Select
                            value={filtroAcao}
                            onValueChange={aplicarFiltro(setFiltroAcao)}
                            disabled={mostrarCarregando}
                        >
                            <SelectTrigger className="w-52">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={TODAS_ACOES}>Todas</SelectItem>
                                {Object.entries(ACAO_LOG_LABEL).map(([valor, label]) => (
                                    <SelectItem key={valor} value={valor}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
                    {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}

                    {resultado?.logs.map((log) => (
                        <div
                            key={log.id}
                            className="grid grid-cols-1 gap-2 rounded-md border border-border p-3 text-sm md:grid-cols-[160px_1fr_auto] md:items-center md:gap-4"
                        >
                            <Badge variant="secondary" className="w-fit">
                                {ACAO_LOG_LABEL[log.acao] ?? log.acao}
                            </Badge>
                            <div>
                                <p className="font-medium">
                                    {log.usuario.nomeCompleto}{' '}
                                    <span className="font-normal text-muted-foreground">
                                        ({log.usuario.login})
                                    </span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {log.imobiliaria.nomeFantasia ?? log.imobiliaria.razaoSocial}
                                    {log.cpfConsultado && ` · CPF consultado: ${log.cpfConsultado}`}
                                </p>
                            </div>
                            <p className="whitespace-nowrap text-xs text-muted-foreground md:text-right">
                                {new Date(log.createdAt).toLocaleDateString('pt-BR')} às{' '}
                                {new Date(log.createdAt).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    ))}

                    {resultado && resultado.logs.length === 0 && (
                        <p className="text-sm text-muted-foreground">Nenhum log encontrado com esses filtros.</p>
                    )}
                </div>

                {resultado && totalPaginas > 1 && (
                    <div className="flex shrink-0 items-center justify-between border-t border-border pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page <= 1 || mostrarCarregando}
                            onClick={() => {
                                setUltimaAcao('anterior')
                                setPage((p) => p - 1)
                            }}
                        >
                            {mostrarCarregando && ultimaAcao === 'anterior' && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            Anterior
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            Página {page} de {totalPaginas}
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPaginas || mostrarCarregando}
                            onClick={() => {
                                setUltimaAcao('proxima')
                                setPage((p) => p + 1)
                            }}
                        >
                            {mostrarCarregando && ultimaAcao === 'proxima' && (
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
