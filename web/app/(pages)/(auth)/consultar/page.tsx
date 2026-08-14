'use client'

import { useMutation } from '@tanstack/react-query'
import { FileSearch, Loader2, Search, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CpfSearchCard } from '@/components/cpf-search-card'
import { formatCpf } from '@/lib/format-cpf'
import { getErrorMessage } from '@/lib/get-error-message'
import { useDelayedLoading } from '@/lib/use-delayed-loading'
import { ocorrenciaService, ConsultaResult, OcorrenciaDetalhe } from '@/app/services/ocorrencia.service'
import { TIPO_OCORRENCIA_LABEL } from '@/shared/constants/tipo-ocorrencia'

export default function ConsultarPage() {
    const [resultado, setResultado] = useState<ConsultaResult | null>(null)
    const [cpfConsultado, setCpfConsultado] = useState('')
    const [detalhes, setDetalhes] = useState<OcorrenciaDetalhe[] | null>(null)

    const consultaMutation = useMutation({
        mutationFn: (cpf: string) => ocorrenciaService.consultar(cpf),
        onSuccess: (data, cpf) => {
            setResultado(data)
            setCpfConsultado(cpf)
            setDetalhes(null)
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Não foi possível consultar o CPF. Tente novamente.'))
        }
    })

    const detalhesMutation = useMutation({
        mutationFn: () => ocorrenciaService.detalhar(cpfConsultado),
        onSuccess: (data) => setDetalhes(data),
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Não foi possível carregar os detalhes.'))
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
                    <CardHeader className="shrink-0 flex-row flex-wrap items-center justify-between gap-4 space-y-0">
                        <div>
                            <CardTitle>
                                {resultado.constamInformacoes ? 'CONSTAM INFORMAÇÕES' : 'NÃO CONSTAM INFORMAÇÕES'}
                            </CardTitle>
                            <CardDescription>CPF {formatCpf(cpfConsultado)}</CardDescription>
                        </div>
                        {resultado.constamInformacoes && (
                            <div className="flex flex-wrap gap-2 sm:justify-end">
                                {resultado.tipos.map((tipo) => (
                                    <Badge key={tipo} variant="secondary">
                                        {TIPO_OCORRENCIA_LABEL[tipo]}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardHeader>
                    {!resultado.constamInformacoes && (
                        <CardContent className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3">
                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                                <ShieldCheck className="h-7 w-7 text-primary" />
                            </span>
                            <p className="max-w-xs text-center text-sm text-muted-foreground">
                                Nenhuma ocorrência foi registrada para esse CPF até o momento.
                            </p>
                        </CardContent>
                    )}

                    {resultado.constamInformacoes && (
                        <CardContent className="scroll-fade-y flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
                            {!detalhes && (
                                <Button
                                    variant="outline"
                                    className="w-fit"
                                    onClick={() => detalhesMutation.mutate()}
                                    disabled={detalhesMutation.isPending}
                                >
                                    {mostrarCarregandoDetalhes && (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    )}
                                    {mostrarCarregandoDetalhes ? 'Carregando...' : 'Ver detalhes'}
                                </Button>
                            )}

                            {detalhes && (
                                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {detalhes.map((ocorrencia) => (
                                        <li
                                            key={ocorrencia.id}
                                            className="rounded-md border border-border p-4 text-sm"
                                        >
                                            <p className="font-medium">
                                                {TIPO_OCORRENCIA_LABEL[ocorrencia.tipo]}
                                            </p>
                                            <p className="mt-1 text-muted-foreground">{ocorrencia.descricao}</p>
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                {ocorrencia.imobiliaria.nomeFantasia ??
                                                    ocorrencia.imobiliaria.razaoSocial}{' '}
                                                · {new Date(ocorrencia.createdAt).toLocaleDateString('pt-BR')} às{' '}
                                                {new Date(ocorrencia.createdAt).toLocaleTimeString('pt-BR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
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
