'use client'

import { useMutation } from '@tanstack/react-query'
import { Building2, Clock, FileSearch, Loader2, Search, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CpfSearchCard } from '@/components/cpf-search-card'
import { formatCpf } from '@/lib/format-cpf'
import { getErrorMessage } from '@/lib/get-error-message'
import { useDelayedLoading } from '@/lib/use-delayed-loading'
import { ocorrenciaService, ConsultaResult, OcorrenciaDetalhe } from '@/app/services/ocorrencia.service'
import { TIPO_OCORRENCIA_ICON, TIPO_OCORRENCIA_LABEL } from '@/shared/constants/tipo-ocorrencia'

export default function ConsultarPage() {
    const [resultado, setResultado] = useState<ConsultaResult | null>(null)
    const [cpfConsultado, setCpfConsultado] = useState('')
    const [detalhes, setDetalhes] = useState<OcorrenciaDetalhe[] | null>(null)

    const detalhesMutation = useMutation({
        mutationFn: (cpf: string) => ocorrenciaService.detalhar(cpf),
        onSuccess: (data) => setDetalhes(data),
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Não foi possível carregar os detalhes.'))
        }
    })

    const consultaMutation = useMutation({
        mutationFn: (cpf: string) => ocorrenciaService.consultar(cpf),
        onSuccess: (data, cpf) => {
            setResultado(data)
            setCpfConsultado(cpf)
            setDetalhes(null)
            if (data.constamInformacoes) {
                detalhesMutation.mutate(cpf)
            }
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Não foi possível consultar o CPF. Tente novamente.'))
        }
    })

    const mostrarCarregandoDetalhes = useDelayedLoading(detalhesMutation.isPending)

    return (
        <div className="grid h-full min-h-0 grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
            <div className="lg:self-start">
                <CpfSearchCard
                    icon={Search}
                    title="Consultar informações"
                    description="Informe o CPF do inquilino"
                    isPending={consultaMutation.isPending}
                    onSubmit={(cpf) => consultaMutation.mutate(cpf)}
                />
            </div>

            {resultado ? (
                <Card className="flex h-full min-h-0 flex-col overflow-hidden">
                    {!resultado.constamInformacoes && (
                        <CardContent className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-6">
                            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                                <ShieldCheck className="h-10 w-10 text-primary" />
                            </span>
                            <div className="flex flex-col items-center gap-1.5">
                                <p className="text-xl font-bold tracking-tight">Não constam informações</p>
                                <p className="text-sm text-muted-foreground">CPF {formatCpf(cpfConsultado)}</p>
                            </div>
                            <p className="max-w-xs text-center text-sm text-muted-foreground">
                                Nenhuma ocorrência foi registrada para esse CPF até o momento.
                            </p>
                        </CardContent>
                    )}

                    {resultado.constamInformacoes && (
                        <>
                            <CardHeader className="shrink-0">
                                <CardTitle>CONSTAM INFORMAÇÕES</CardTitle>
                                <CardDescription>
                                    CPF {formatCpf(cpfConsultado)}
                                    {detalhes && ` · ${detalhes.length} ocorrência(s) registrada(s)`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="scroll-fade-y flex min-h-0 flex-1 flex-col overflow-y-auto">
                                {!detalhes && (
                                    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3">
                                        {mostrarCarregandoDetalhes && (
                                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                        )}
                                        <p className="text-sm text-muted-foreground">Carregando detalhes...</p>
                                    </div>
                                )}

                                {detalhes && (
                                    <ul className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                                        {detalhes.map((ocorrencia) => {
                                            const Icon = TIPO_OCORRENCIA_ICON[ocorrencia.tipo]
                                            return (
                                                <li
                                                    key={ocorrencia.id}
                                                    className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                                            <Icon className="h-5 w-5" />
                                                        </span>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                                <Badge variant="secondary">
                                                                    {TIPO_OCORRENCIA_LABEL[ocorrencia.tipo]}
                                                                </Badge>
                                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                    <Clock className="h-3 w-3" />
                                                                    {new Date(
                                                                        ocorrencia.createdAt
                                                                    ).toLocaleDateString('pt-BR')}{' '}
                                                                    às{' '}
                                                                    {new Date(
                                                                        ocorrencia.createdAt
                                                                    ).toLocaleTimeString('pt-BR', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <p className="mt-3 text-sm leading-relaxed text-foreground">
                                                                {ocorrencia.descricao}
                                                            </p>
                                                            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                                <Building2 className="h-3.5 w-3.5" />
                                                                {ocorrencia.imobiliaria.nomeFantasia ??
                                                                    ocorrencia.imobiliaria.razaoSocial}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </CardContent>
                        </>
                    )}
                </Card>
            ) : (
                <Card className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 border-dashed p-6">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <FileSearch className="h-7 w-7 text-muted-foreground" />
                    </span>
                    <p className="max-w-xs text-center text-sm text-muted-foreground">
                        Informe um CPF ao lado para consultar as ocorrências registradas
                    </p>
                </Card>
            )}
        </div>
    )
}
