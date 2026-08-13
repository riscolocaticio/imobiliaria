'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CpfInput } from '@/components/ui/cpf-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { isCpfComplete } from '@/lib/format-cpf'
import { ocorrenciaService, OcorrenciaCreateInput } from '@/app/services/ocorrencia.service'
import { TIPO_OCORRENCIA_OPTIONS } from '@/shared/constants/tipo-ocorrencia'

const inserirSchema = z.object({
    nomeInquilinoInformado: z.string().min(1, 'Informe o nome completo do inquilino'),
    cpfInquilino: z.string().refine(isCpfComplete, 'Informe um CPF válido'),
    tipo: z.string().min(1, 'Selecione o tipo de ocorrência'),
    descricao: z
        .string()
        .min(1, 'Descreva a ocorrência')
        .max(1000, 'A descrição deve ter no máximo 1000 caracteres')
})

type InserirFormValues = z.infer<typeof inserirSchema>

export default function InserirPage() {
    const [sucesso, setSucesso] = useState(false)

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<InserirFormValues>({ resolver: zodResolver(inserirSchema) })

    const inserirMutation = useMutation({
        mutationFn: (values: InserirFormValues) =>
            ocorrenciaService.inserir(values as OcorrenciaCreateInput),
        onSuccess: () => {
            setSucesso(true)
            reset()
        }
    })

    return (
        <Card className="mx-auto max-w-3xl">
            <CardHeader>
                <CardTitle>Inserir informações</CardTitle>
                <CardDescription>Registre uma ocorrência locatícia de forma simples e objetiva</CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit((values) => {
                        setSucesso(false)
                        inserirMutation.mutate(values)
                    })}
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="nomeInquilinoInformado" required>
                                Nome completo do inquilino
                            </Label>
                            <Input id="nomeInquilinoInformado" {...register('nomeInquilinoInformado')} />
                            {errors.nomeInquilinoInformado && (
                                <p className="text-xs text-destructive">
                                    {errors.nomeInquilinoInformado.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="cpfInquilino" required>
                                CPF
                            </Label>
                            <CpfInput id="cpfInquilino" {...register('cpfInquilino')} />
                            {errors.cpfInquilino && (
                                <p className="text-xs text-destructive">{errors.cpfInquilino.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="tipo" required>
                            Tipo de ocorrência
                        </Label>
                        <Controller
                            name="tipo"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger id="tipo">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIPO_OCORRENCIA_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.tipo && <p className="text-xs text-destructive">{errors.tipo.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="descricao" required>
                            Descreva a ocorrência
                        </Label>
                        <Textarea id="descricao" className="min-h-40" {...register('descricao')} />
                        {errors.descricao && (
                            <p className="text-xs text-destructive">{errors.descricao.message}</p>
                        )}
                    </div>

                    {inserirMutation.isError && (
                        <p className="text-sm text-destructive">
                            Não foi possível registrar a ocorrência. Tente novamente.
                        </p>
                    )}
                    {sucesso && <p className="text-sm text-emerald-600">Ocorrência registrada com sucesso.</p>}

                    <Button type="submit" disabled={inserirMutation.isPending}>
                        {inserirMutation.isPending ? 'Registrando...' : 'Confirmar'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
