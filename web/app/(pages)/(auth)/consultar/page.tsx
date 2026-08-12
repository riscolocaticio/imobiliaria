'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCpf } from '@/lib/format-cpf'
import { ocorrenciaService, ConsultaResult, OcorrenciaDetalhe } from '@/app/services/ocorrencia.service'
import { TIPO_OCORRENCIA_LABEL } from '@/shared/constants/tipo-ocorrencia'

const cpfSchema = z.object({
    cpf: z.string().min(11, 'Informe um CPF válido').max(14)
})

type CpfFormValues = z.infer<typeof cpfSchema>

export default function ConsultarPage() {
    const [resultado, setResultado] = useState<ConsultaResult | null>(null)
    const [cpfConsultado, setCpfConsultado] = useState('')
    const [detalhes, setDetalhes] = useState<OcorrenciaDetalhe[] | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CpfFormValues>({ resolver: zodResolver(cpfSchema) })

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
        <div className="mx-auto flex max-w-md flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Consultar informações</CardTitle>
                    <CardDescription>Informe o CPF do inquilino</CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit((values) => consultaMutation.mutate(values.cpf))}
                    >
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="cpf" required>
                                CPF do inquilino
                            </Label>
                            <Input id="cpf" placeholder="000.000.000-00" {...register('cpf')} />
                            {errors.cpf && (
                                <p className="text-xs text-destructive">{errors.cpf.message}</p>
                            )}
                        </div>

                        <Button type="submit" disabled={consultaMutation.isPending}>
                            {consultaMutation.isPending ? 'Consultando...' : 'Consultar'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {resultado && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {resultado.constamInformacoes ? 'CONSTAM INFORMAÇÕES' : 'NÃO CONSTAM INFORMAÇÕES'}
                        </CardTitle>
                        <CardDescription>CPF {formatCpf(cpfConsultado)}</CardDescription>
                    </CardHeader>
                    {resultado.constamInformacoes && (
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-wrap gap-2">
                                {resultado.tipos.map((tipo) => (
                                    <Badge key={tipo} variant="secondary">
                                        {TIPO_OCORRENCIA_LABEL[tipo]}
                                    </Badge>
                                ))}
                            </div>

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
                                            className="rounded-md border border-border p-3 text-sm"
                                        >
                                            <p className="font-medium">
                                                {TIPO_OCORRENCIA_LABEL[ocorrencia.tipo]}
                                            </p>
                                            <p className="mt-1 text-muted-foreground">{ocorrencia.descricao}</p>
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                {ocorrencia.imobiliaria.nomeFantasia ??
                                                    ocorrencia.imobiliaria.razaoSocial}{' '}
                                                · {new Date(ocorrencia.createdAt).toLocaleDateString('pt-BR')}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    )}
                </Card>
            )}
        </div>
    )
}
