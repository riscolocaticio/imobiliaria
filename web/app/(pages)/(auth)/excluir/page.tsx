'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CpfInput } from '@/components/ui/cpf-input'
import { Label } from '@/components/ui/label'
import { isCpfComplete } from '@/lib/format-cpf'
import { ocorrenciaService, OcorrenciaExcluivel } from '@/app/services/ocorrencia.service'
import { TIPO_OCORRENCIA_LABEL } from '@/shared/constants/tipo-ocorrencia'

const cpfSchema = z.object({
    cpf: z.string().refine(isCpfComplete, 'Informe um CPF válido')
})

type CpfFormValues = z.infer<typeof cpfSchema>

export default function ExcluirPage() {
    const [registros, setRegistros] = useState<OcorrenciaExcluivel[] | null>(null)
    const [excluindoId, setExcluindoId] = useState<number | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CpfFormValues>({ resolver: zodResolver(cpfSchema) })

    const listarMutation = useMutation({
        mutationFn: (cpf: string) => ocorrenciaService.listarExcluiveis(cpf),
        onSuccess: setRegistros
    })

    const excluirMutation = useMutation({
        mutationFn: (id: number) => ocorrenciaService.excluir(id),
        onSuccess: (_data, id) => {
            setRegistros((atual) => atual?.filter((registro) => registro.id !== id) ?? null)
            setExcluindoId(null)
        }
    })

    return (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[360px_1fr]">
            <Card>
                <CardHeader>
                    <CardTitle>Excluir informações</CardTitle>
                    <CardDescription>
                        Consulte o CPF para ver os registros que sua imobiliária pode administrar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit((values) => listarMutation.mutate(values.cpf))}
                    >
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="cpf" required>
                                CPF do inquilino
                            </Label>
                            <CpfInput id="cpf" {...register('cpf')} />
                            {errors.cpf && (
                                <p className="text-xs text-destructive">{errors.cpf.message}</p>
                            )}
                        </div>

                        <Button type="submit" disabled={listarMutation.isPending}>
                            {listarMutation.isPending ? 'Consultando...' : 'Consultar'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {registros ? (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {registros.length === 0
                                ? 'Nenhum registro administrável por sua imobiliária'
                                : 'Registros da sua imobiliária'}
                        </CardTitle>
                    </CardHeader>
                    {registros.length > 0 && (
                        <CardContent className="flex flex-col gap-3">
                            {registros.map((registro) => (
                                <div
                                    key={registro.id}
                                    className="flex flex-col gap-4 rounded-md border border-border p-4 text-sm md:grid md:grid-cols-[1fr_auto] md:items-center"
                                >
                                    <div className="flex flex-col gap-2 md:grid md:grid-cols-[200px_1fr] md:items-center md:gap-4">
                                        <div>
                                            <p className="font-medium">
                                                {TIPO_OCORRENCIA_LABEL[registro.tipo]}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {new Date(registro.createdAt).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                        <p className="text-muted-foreground">{registro.descricao}</p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="w-full md:w-auto"
                                        disabled={excluirMutation.isPending && excluindoId === registro.id}
                                        onClick={() => {
                                            setExcluindoId(registro.id)
                                            excluirMutation.mutate(registro.id)
                                        }}
                                    >
                                        {excluirMutation.isPending && excluindoId === registro.id
                                            ? 'Excluindo...'
                                            : 'Excluir'}
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    )}
                </Card>
            ) : (
                <Card className="flex min-h-[220px] items-center justify-center border-dashed p-6 lg:min-h-[280px]">
                    <p className="max-w-xs text-center text-sm text-muted-foreground">
                        Informe um CPF para ver os registros administráveis pela sua imobiliária
                    </p>
                </Card>
            )}
        </div>
    )
}
