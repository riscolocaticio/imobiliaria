'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CpfInput } from '@/components/ui/cpf-input'
import { Label } from '@/components/ui/label'
import { isCpfComplete } from '@/lib/format-cpf'

const cpfSchema = z.object({
    cpf: z.string().refine(isCpfComplete, 'Informe um CPF válido')
})

type CpfFormValues = z.infer<typeof cpfSchema>

export interface CpfSearchCardProps {
    title: string
    description: string
    buttonLabel?: string
    buttonLoadingLabel?: string
    isPending: boolean
    onSubmit: (cpf: string) => void
}

export function CpfSearchCard({
    title,
    description,
    buttonLabel = 'Consultar',
    buttonLoadingLabel = 'Consultando...',
    isPending,
    onSubmit
}: CpfSearchCardProps) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CpfFormValues>({ resolver: zodResolver(cpfSchema) })

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    className="flex flex-col gap-6"
                    noValidate
                    onSubmit={handleSubmit((values) => onSubmit(values.cpf))}
                >
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="cpf" required>
                            CPF do inquilino
                        </Label>
                        <CpfInput id="cpf" className="h-11" {...register('cpf')} />
                        {errors.cpf && <p className="text-xs text-destructive">{errors.cpf.message}</p>}
                    </div>

                    <Button type="submit" size="lg" className="mt-1" disabled={isPending}>
                        {isPending ? buttonLoadingLabel : buttonLabel}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
