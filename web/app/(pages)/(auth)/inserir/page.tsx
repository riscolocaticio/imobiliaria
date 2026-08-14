'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CpfInput } from '@/components/ui/cpf-input'
import { FloatingField } from '@/components/ui/floating-field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getErrorMessage } from '@/lib/get-error-message'
import { isCpfComplete } from '@/lib/format-cpf'
import { useDelayedLoading } from '@/lib/use-delayed-loading'
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
    const [formKey, setFormKey] = useState(0)

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<InserirFormValues>({
        resolver: zodResolver(inserirSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        defaultValues: {
            nomeInquilinoInformado: '',
            cpfInquilino: '',
            tipo: '',
            descricao: ''
        }
    })

    const inserirMutation = useMutation({
        mutationFn: (values: InserirFormValues) =>
            ocorrenciaService.inserir(values as OcorrenciaCreateInput),
        onSuccess: () => {
            toast.success('Ocorrência registrada com sucesso.')
            reset()
            setFormKey((atual) => atual + 1)
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Não foi possível registrar a ocorrência. Tente novamente.'))
        }
    })

    const mostrarCarregando = useDelayedLoading(inserirMutation.isPending)

    return (
        <Card className="flex h-full min-h-0 flex-col">
            <CardHeader className="shrink-0">
                <CardTitle>Inserir informações</CardTitle>
                <CardDescription>Registre uma ocorrência locatícia de forma simples e objetiva</CardDescription>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col">
                <form
                    className="flex h-full min-h-0 flex-col gap-5"
                    noValidate
                    onSubmit={handleSubmit((values) => inserirMutation.mutate(values))}
                >
                    <div className="grid shrink-0 grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr_1fr]">
                        <FloatingField
                            label="Nome completo do inquilino"
                            htmlFor="nomeInquilinoInformado"
                            required
                            error={errors.nomeInquilinoInformado?.message}
                        >
                            <Input {...register('nomeInquilinoInformado')} />
                        </FloatingField>

                        <FloatingField
                            label="CPF"
                            htmlFor="cpfInquilino"
                            required
                            error={errors.cpfInquilino?.message}
                        >
                            <CpfInput {...register('cpfInquilino')} />
                        </FloatingField>

                        <div className="flex flex-col gap-1.5">
                            <Controller
                                key={formKey}
                                name="tipo"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger id="tipo">
                                            <SelectValue placeholder="Tipo de ocorrência" />
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
                    </div>

                    <FloatingField
                        label="Descreva a ocorrência"
                        htmlFor="descricao"
                        required
                        error={errors.descricao?.message}
                        multiline
                        className="min-h-0 flex-1"
                    >
                        <Textarea
                            placeholder="Preencher com os detalhes relevantes da ocorrência..."
                            className="h-full min-h-40 flex-1 resize-none"
                            {...register('descricao')}
                        />
                    </FloatingField>

                    <Button
                        type="submit"
                        className="shrink-0 lg:w-fit lg:self-end"
                        disabled={inserirMutation.isPending}
                    >
                        {mostrarCarregando && <Loader2 className="h-4 w-4 animate-spin" />}
                        {mostrarCarregando ? 'Registrando...' : 'Confirmar'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
