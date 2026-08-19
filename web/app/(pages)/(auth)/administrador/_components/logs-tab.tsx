'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Building2, Clock, FileClock, IdCard, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ListagemCard } from '@/components/ui/listagem-card'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDelayedLoading } from '@/lib/use-delayed-loading'
import { imobiliariaService } from '@/app/services/imobiliaria.service'
import { ACAO_LOG_ICON, ACAO_LOG_ICON_PADRAO, ACAO_LOG_LABEL, formatarAcaoLog, logService } from '@/app/services/log.service'

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
        <ListagemCard
            title="Logs de auditoria"
            description={`${resultado?.total ?? 0} registro(s) no total`}
            isLoading={isLoading}
            isEmpty={resultado?.logs.length === 0}
            emptyIcon={FileClock}
            emptyMessage="Nenhum log encontrado com esses filtros."
            pagination={{
                page,
                totalPaginas,
                mostrarCarregando,
                ultimaAcao,
                onAnterior: () => {
                    setUltimaAcao('anterior')
                    setPage((p) => p - 1)
                },
                onProxima: () => {
                    setUltimaAcao('proxima')
                    setPage((p) => p + 1)
                }
            }}
            headerActions={
                <>
                    <div className="relative w-full md:w-52">
                        <SearchableSelect
                            value={filtroImobiliaria}
                            onValueChange={aplicarFiltro(setFiltroImobiliaria)}
                            disabled={mostrarCarregando}
                            searchPlaceholder="Buscar imobiliária..."
                            options={[
                                { value: TODAS_IMOBILIARIAS, label: 'Todas as imobiliárias' },
                                ...(imobiliarias?.map((imobiliaria) => ({
                                    value: String(imobiliaria.id),
                                    label: imobiliaria.nomeFantasia ?? imobiliaria.razaoSocial
                                })) ?? [])
                            ]}
                        />
                        {mostrarCarregando && ultimaAcao === 'filtro' && (
                            <Loader2 className="pointer-events-none absolute right-8 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                        )}
                    </div>
                    <Select
                        value={filtroAcao}
                        onValueChange={aplicarFiltro(setFiltroAcao)}
                        disabled={mostrarCarregando}
                    >
                        <SelectTrigger className="w-full md:w-52">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={TODAS_ACOES}>Todas as ações</SelectItem>
                            {Object.entries(ACAO_LOG_LABEL).map(([valor, label]) => (
                                <SelectItem key={valor} value={valor}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </>
            }
        >
            {resultado?.logs.map((log) => {
                const Icon = ACAO_LOG_ICON[log.acao] ?? ACAO_LOG_ICON_PADRAO
                return (
                    <div key={log.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Icon className="h-4 w-4" />
                                </span>
                                <Badge variant="secondary">{formatarAcaoLog(log.acao)}</Badge>
                            </div>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {new Date(log.createdAt).toLocaleDateString('pt-BR')} às{' '}
                                {new Date(log.createdAt).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                        <div className="mt-2 pl-11">
                            <p className="truncate text-sm font-medium">
                                {log.usuario.nomeCompleto}{' '}
                                <span className="font-normal text-muted-foreground">({log.usuario.login})</span>
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5" />
                                    {log.imobiliaria.nomeFantasia ?? log.imobiliaria.razaoSocial}
                                </span>
                                {log.cpfConsultado && (
                                    <span className="flex items-center gap-1.5">
                                        <IdCard className="h-3.5 w-3.5" />
                                        CPF consultado: {log.cpfConsultado}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </ListagemCard>
    )
}
