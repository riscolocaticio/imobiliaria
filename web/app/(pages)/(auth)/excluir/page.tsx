'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ocorrenciaService, OcorrenciaExcluivel } from '@/app/services/ocorrencia.service'
import { TIPO_OCORRENCIA_LABEL } from '@/shared/constants/tipo-ocorrencia'

const cpfSchema = z.object({
    cpf: z.string().min(11, 'Informe um CPF válido').max(14)
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
        <div className="mx-auto flex max-w-md flex-col gap-6">
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
                            <Input id="cpf" placeholder="000.000.000-00" {...register('cpf')} />
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

            {registros && (
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
                                    className="flex flex-col gap-2 rounded-md border border-border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div>
                                        <p className="font-medium">{TIPO_OCORRENCIA_LABEL[registro.tipo]}</p>
                                        <p className="text-muted-foreground">{registro.descricao}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {new Date(registro.createdAt).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
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
            )}
        </div>
    )
}
