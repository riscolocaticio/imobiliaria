'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Building2, Clock, FileSearch, User } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { CpfInput } from '@/components/ui/cpf-input'
import { ListagemCard } from '@/components/ui/listagem-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCpf, isCpfComplete } from '@/lib/format-cpf'
import { useDelayedLoading } from '@/lib/use-delayed-loading'
import { imobiliariaService } from '@/app/services/imobiliaria.service'
import { ocorrenciaService } from '@/app/services/ocorrencia.service'
import {
    TIPO_OCORRENCIA_ICON,
    TIPO_OCORRENCIA_LABEL,
    TIPO_OCORRENCIA_OPTIONS,
    type TipoOcorrencia
} from '@/shared/constants/tipo-ocorrencia'
import { SITUACAO_OCORRENCIA_LABEL } from '@/shared/constants/situacao-ocorrencia'
import { FAIXA_VALOR_OCORRENCIA_LABEL } from '@/shared/constants/faixa-valor-ocorrencia'

const TODAS_IMOBILIARIAS = 'todas'
const TODOS_TIPOS = 'todos'
const TODOS_STATUS = 'todos'
const PAGE_SIZE = 20

export function OcorrenciasTab() {
    const [filtroImobiliaria, setFiltroImobiliaria] = useState(TODAS_IMOBILIARIAS)
    const [filtroTipo, setFiltroTipo] = useState(TODOS_TIPOS)
    const [filtroStatus, setFiltroStatus] = useState(TODOS_STATUS)
    const [filtroCpf, setFiltroCpf] = useState('')
    const [page, setPage] = useState(1)
    const [ultimaAcao, setUltimaAcao] = useState<'anterior' | 'proxima' | 'filtro' | null>(null)

    const { data: imobiliarias } = useQuery({
        queryKey: ['admin-imobiliarias'],
        queryFn: () => imobiliariaService.listar()
    })

    const cpfCompleto = isCpfComplete(filtroCpf) ? filtroCpf.replace(/\D/g, '') : undefined

    const { data: resultado, isLoading, isFetching } = useQuery({
        queryKey: ['admin-ocorrencias', filtroImobiliaria, filtroTipo, filtroStatus, cpfCompleto, page],
        queryFn: () =>
            ocorrenciaService.listarTodasAdmin({
                imobiliariaId: filtroImobiliaria === TODAS_IMOBILIARIAS ? undefined : Number(filtroImobiliaria),
                tipo: filtroTipo === TODOS_TIPOS ? undefined : (filtroTipo as TipoOcorrencia),
                status: filtroStatus === TODOS_STATUS ? undefined : (filtroStatus as 'ATIVA' | 'EXCLUIDA'),
                cpf: cpfCompleto,
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
            title="Ocorrências registradas"
            description={`${resultado?.total ?? 0} registro(s) no total`}
            isLoading={isLoading}
            isEmpty={resultado?.ocorrencias.length === 0}
            emptyIcon={FileSearch}
            emptyMessage="Nenhuma ocorrência encontrada com esses filtros."
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
                    <div className="w-44">
                        <CpfInput
                            value={filtroCpf}
                            onChange={(event) => {
                                setUltimaAcao('filtro')
                                setFiltroCpf(event.target.value)
                                setPage(1)
                            }}
                            placeholder="Buscar por CPF"
                        />
                    </div>
                    <Select
                        value={filtroImobiliaria}
                        onValueChange={aplicarFiltro(setFiltroImobiliaria)}
                        disabled={mostrarCarregando}
                    >
                        <SelectTrigger className="w-48">
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
                    <Select
                        value={filtroTipo}
                        onValueChange={aplicarFiltro(setFiltroTipo)}
                        disabled={mostrarCarregando}
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={TODOS_TIPOS}>Todos os tipos</SelectItem>
                            {TIPO_OCORRENCIA_OPTIONS.map((tipo) => (
                                <SelectItem key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={filtroStatus}
                        onValueChange={aplicarFiltro(setFiltroStatus)}
                        disabled={mostrarCarregando}
                    >
                        <SelectTrigger className="w-36">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={TODOS_STATUS}>Todos</SelectItem>
                            <SelectItem value="ATIVA">Ativas</SelectItem>
                            <SelectItem value="EXCLUIDA">Excluídas</SelectItem>
                        </SelectContent>
                    </Select>
                </>
            }
        >
            {resultado?.ocorrencias.map((ocorrencia) => {
                const Icon = TIPO_OCORRENCIA_ICON[ocorrencia.tipo]
                return (
                    <div key={ocorrencia.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                    <Icon className="h-4 w-4" />
                                </span>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="secondary">{TIPO_OCORRENCIA_LABEL[ocorrencia.tipo]}</Badge>
                                    <Badge variant="outline">{SITUACAO_OCORRENCIA_LABEL[ocorrencia.situacaoAtual]}</Badge>
                                    <Badge variant="outline">{FAIXA_VALOR_OCORRENCIA_LABEL[ocorrencia.faixaValor]}</Badge>
                                    {ocorrencia.status === 'EXCLUIDA' && <Badge variant="outline">Excluída</Badge>}
                                </div>
                            </div>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                Ocorrido em {new Date(ocorrencia.dataOcorrencia).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                        <div className="mt-2 pl-11">
                            <p className="text-sm font-medium">
                                {formatCpf(ocorrencia.cpfInquilino)} · {ocorrencia.nomeInquilinoInformado}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {ocorrencia.observacoes}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5" />
                                    {ocorrencia.imobiliaria.nomeFantasia ?? ocorrencia.imobiliaria.razaoSocial}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5" />
                                    {ocorrencia.usuario.nomeCompleto} ({ocorrencia.usuario.login})
                                </span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </ListagemCard>
    )
}
