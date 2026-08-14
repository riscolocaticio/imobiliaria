'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { FileClock, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ListagemCard } from '@/components/ui/listagem-card'
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
                    <div className="relative">
                        <Select
                            value={filtroImobiliaria}
                            onValueChange={aplicarFiltro(setFiltroImobiliaria)}
                            disabled={mostrarCarregando}
                        >
                            <SelectTrigger className="w-52">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={TODAS_IMOBILIARIAS}>Todas as imobiliárias</SelectItem>
                                {imobiliarias?.map((imobiliaria) => (
                                    <SelectItem key={imobiliaria.id} value={String(imobiliaria.id)}>
                                        {imobiliaria.nomeFantasia ?? imobiliaria.razaoSocial}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {mostrarCarregando && ultimaAcao === 'filtro' && (
                            <Loader2 className="pointer-events-none absolute right-8 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                        )}
                    </div>
                    <Select
                        value={filtroAcao}
                        onValueChange={aplicarFiltro(setFiltroAcao)}
                        disabled={mostrarCarregando}
                    >
                        <SelectTrigger className="w-52">
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
            {resultado?.logs.map((log) => (
                <div
                    key={log.id}
                    className="mb-3 grid grid-cols-1 gap-2 rounded-md border border-border p-3 text-sm last:mb-0 md:grid-cols-[160px_1fr_auto] md:items-center md:gap-4"
                >
                    <Badge variant="secondary" className="w-fit">
                        {ACAO_LOG_LABEL[log.acao] ?? log.acao}
                    </Badge>
                    <div>
                        <p className="font-medium">
                            {log.usuario.nomeCompleto}{' '}
                            <span className="font-normal text-muted-foreground">({log.usuario.login})</span>
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
        </ListagemCard>
    )
}
