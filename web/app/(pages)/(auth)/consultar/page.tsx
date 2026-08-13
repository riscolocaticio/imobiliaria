'use client'

import { useMutation } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card'
import { CpfSearchCard } from '@/components/cpf-search-card'
import { formatCpf } from '@/lib/format-cpf'
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
        }
    })

    const detalhesMutation = useMutation({
        mutationFn: () => ocorrenciaService.detalhar(cpfConsultado),
        onSuccess: (data) => setDetalhes(data)
    })

    return (
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[360px_1fr]">
            <CpfSearchCard
                icon={Search}
                title="Consultar informações"
                description="Informe o CPF do inquilino"
                isPending={consultaMutation.isPending}
                onSubmit={(cpf) => consultaMutation.mutate(cpf)}
            />

            {resultado ? (
                <Card className="overflow-hidden">
                    <CardHeader className="gap-4 border-b border-border bg-muted/40">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-1.5">
                                <Badge
                                    variant={resultado.constamInformacoes ? 'destructive' : 'default'}
                                    className="w-fit px-3 py-1 text-xs tracking-wide"
                                >
                                    {resultado.constamInformacoes ? 'CONSTAM INFORMAÇÕES' : 'NÃO CONSTAM INFORMAÇÕES'}
                                </Badge>
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
                        </div>
                    </CardHeader>
                    {resultado.constamInformacoes && (
                        <CardContent className="flex flex-col gap-4 pt-6">
                            {!detalhes && (
                                <Button
                                    variant="outline"
                                    onClick={() => detalhesMutation.mutate()}
                                    disabled={detalhesMutation.isPending}
                                >
                                    {detalhesMutation.isPending ? 'Carregando...' : 'Ver detalhes'}
                                </Button>
                            )}

                            {detalhes && (
                                <ul className="flex flex-col gap-3">
                                    {detalhes.map((ocorrencia) => (
                                        <li
                                            key={ocorrencia.id}
                                            className="grid grid-cols-1 gap-3 rounded-lg border border-border p-4 text-sm md:grid-cols-[220px_1fr_auto] md:items-center md:gap-6"
                                        >
                                            <div>
                                                <p className="font-semibold">
                                                    {TIPO_OCORRENCIA_LABEL[ocorrencia.tipo]}
                                                </p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {ocorrencia.imobiliaria.nomeFantasia ??
                                                        ocorrencia.imobiliaria.razaoSocial}
                                                </p>
                                            </div>
                                            <p className="text-muted-foreground">{ocorrencia.descricao}</p>
                                            <p className="whitespace-nowrap text-xs text-muted-foreground md:text-right">
                                                {new Date(ocorrencia.createdAt).toLocaleDateString('pt-BR')} às{' '}
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
                <Card className="flex min-h-[220px] items-center justify-center border-dashed p-6 lg:min-h-[280px]">
                    <p className="max-w-xs text-center text-sm text-muted-foreground">
                        Informe um CPF para consultar as ocorrências registradas
                    </p>
                </Card>
            )}
        </div>
    )
}
