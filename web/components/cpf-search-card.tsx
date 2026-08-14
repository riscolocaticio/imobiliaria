'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Search, type LucideIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CpfInput } from '@/components/ui/cpf-input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { isCpfComplete } from '@/lib/format-cpf'
import { useDelayedLoading } from '@/lib/use-delayed-loading'

const cpfSchema = z.object({
    cpf: z.string().refine(isCpfComplete, 'Informe um CPF válido')
})

type CpfFormValues = z.infer<typeof cpfSchema>

export interface CpfSearchCardProps {
    icon?: LucideIcon
    title: string
    description: string
    buttonLabel?: string
    buttonLoadingLabel?: string
    isPending: boolean
    onSubmit: (cpf: string) => void
}

export function CpfSearchCard({
    icon: Icon,
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
    } = useForm<CpfFormValues>({
        resolver: zodResolver(cpfSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit'
    })
    const mostrarCarregando = useDelayedLoading(isPending)

    return (
        <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0">
                {Icon && (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                    </span>
                )}
                <div className="flex flex-col gap-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <form
                    className="flex flex-col gap-5"
                    noValidate
                    onSubmit={handleSubmit((values) => onSubmit(values.cpf))}
                >
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="cpf" required>
                            CPF do inquilino
                        </Label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <CpfInput
                                id="cpf"
                                className={cn('h-11 pl-9', errors.cpf && 'border-destructive')}
                                {...register('cpf')}
                            />
                        </div>
                        {errors.cpf && <p className="text-xs text-destructive">{errors.cpf.message}</p>}
                    </div>

                    <Button type="submit" size="lg" disabled={isPending}>
                        {mostrarCarregando && <Loader2 className="h-4 w-4 animate-spin" />}
                        {mostrarCarregando ? buttonLoadingLabel : buttonLabel}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
