'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CnpjInput } from '@/components/ui/cnpj-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCnpj, isCnpjComplete } from '@/lib/format-cnpj'
import { getErrorMessage } from '@/lib/get-error-message'
import {
    imobiliariaService,
    ImobiliariaComContagem
} from '@/app/services/imobiliaria.service'

const imobiliariaSchema = z.object({
    razaoSocial: z.string().min(1, 'Informe a razão social'),
    nomeFantasia: z.string().optional(),
    cnpj: z.string().refine(isCnpjComplete, 'Informe um CNPJ válido'),
    email: z.string().email('E-mail inválido')
})

type ImobiliariaFormValues = z.infer<typeof imobiliariaSchema>

export function ImobiliariasTab() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [editandoId, setEditandoId] = useState<number | null>(null)
    const [edicao, setEdicao] = useState({ razaoSocial: '', nomeFantasia: '', email: '' })
    const queryClient = useQueryClient()

    const { data: imobiliarias } = useQuery({
        queryKey: ['admin-imobiliarias'],
        queryFn: () => imobiliariaService.listar()
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ImobiliariaFormValues>({
        resolver: zodResolver(imobiliariaSchema),
        defaultValues: { razaoSocial: '', nomeFantasia: '', cnpj: '', email: '' }
    })

    const criarMutation = useMutation({
        mutationFn: (values: ImobiliariaFormValues) => imobiliariaService.criar(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-imobiliarias'] })
            toast.success('Imobiliária criada com sucesso.')
            reset()
            setMostrarFormulario(false)
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Não foi possível criar a imobiliária. Verifique os dados e tente novamente.'))
        }
    })

    const atualizarMutation = useMutation({
        mutationFn: ({
            id,
            input
        }: {
            id: number
            input: { razaoSocial?: string; nomeFantasia?: string; email?: string; status?: 'ATIVO' | 'INATIVO' }
        }) => imobiliariaService.atualizar(id, input),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin-imobiliarias'] })
            toast.success(
                variables.input.status ? 'Status atualizado com sucesso.' : 'Imobiliária atualizada com sucesso.'
            )
            setEditandoId(null)
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Não foi possível atualizar a imobiliária.'))
        }
    })

    function iniciarEdicao(imobiliaria: ImobiliariaComContagem) {
        setEditandoId(imobiliaria.id)
        setEdicao({
            razaoSocial: imobiliaria.razaoSocial,
            nomeFantasia: imobiliaria.nomeFantasia ?? '',
            email: imobiliaria.email
        })
    }

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                        <CardTitle>Imobiliárias cadastradas</CardTitle>
                        <CardDescription>{imobiliarias?.length ?? 0} imobiliária(s)</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setMostrarFormulario((v) => !v)}>
                        {mostrarFormulario ? 'Cancelar' : 'Nova imobiliária'}
                    </Button>
                </CardHeader>

                {mostrarFormulario && (
                    <CardContent className="border-b border-border pb-6">
                        <form
                            className="flex flex-col gap-4"
                            noValidate
                            onSubmit={handleSubmit((values) => criarMutation.mutate(values))}
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="razaoSocial" required>
                                        Razão social
                                    </Label>
                                    <Input id="razaoSocial" {...register('razaoSocial')} />
                                    {errors.razaoSocial && (
                                        <p className="text-xs text-destructive">{errors.razaoSocial.message}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="nomeFantasia">Nome fantasia</Label>
                                    <Input id="nomeFantasia" {...register('nomeFantasia')} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="cnpj" required>
                                        CNPJ
                                    </Label>
                                    <CnpjInput id="cnpj" {...register('cnpj')} />
                                    {errors.cnpj && (
                                        <p className="text-xs text-destructive">{errors.cnpj.message}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="email" required>
                                        E-mail
                                    </Label>
                                    <Input id="email" type="email" {...register('email')} />
                                    {errors.email && (
                                        <p className="text-xs text-destructive">{errors.email.message}</p>
                                    )}
                                </div>
                            </div>
                            <Button type="submit" className="w-fit" disabled={criarMutation.isPending}>
                                {criarMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                {criarMutation.isPending ? 'Salvando...' : 'Salvar imobiliária'}
                            </Button>
                        </form>
                    </CardContent>
                )}

                <CardContent className="flex flex-col gap-3 pt-6">
                    {imobiliarias?.map((imobiliaria) => (
                        <div
                            key={imobiliaria.id}
                            className="flex flex-col gap-3 rounded-md border border-border p-4 text-sm"
                        >
                            {editandoId === imobiliaria.id ? (
                                <div className="flex flex-col gap-3">
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor={`razaoSocial-${imobiliaria.id}`}>Razão social</Label>
                                            <Input
                                                id={`razaoSocial-${imobiliaria.id}`}
                                                value={edicao.razaoSocial}
                                                onChange={(e) =>
                                                    setEdicao((v) => ({ ...v, razaoSocial: e.target.value }))
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor={`nomeFantasia-${imobiliaria.id}`}>Nome fantasia</Label>
                                            <Input
                                                id={`nomeFantasia-${imobiliaria.id}`}
                                                value={edicao.nomeFantasia}
                                                onChange={(e) =>
                                                    setEdicao((v) => ({ ...v, nomeFantasia: e.target.value }))
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor={`email-${imobiliaria.id}`}>E-mail</Label>
                                        <Input
                                            id={`email-${imobiliaria.id}`}
                                            value={edicao.email}
                                            onChange={(e) => setEdicao((v) => ({ ...v, email: e.target.value }))}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            disabled={atualizarMutation.isPending}
                                            onClick={() =>
                                                atualizarMutation.mutate({ id: imobiliaria.id, input: edicao })
                                            }
                                        >
                                            {atualizarMutation.isPending &&
                                                atualizarMutation.variables?.id === imobiliaria.id && (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                )}
                                            {atualizarMutation.isPending &&
                                            atualizarMutation.variables?.id === imobiliaria.id
                                                ? 'Salvando...'
                                                : 'Salvar'}
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => setEditandoId(null)}>
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 font-medium">
                                            {imobiliaria.nomeFantasia ?? imobiliaria.razaoSocial}
                                            <Badge variant={imobiliaria.status === 'ATIVO' ? 'default' : 'outline'}>
                                                {imobiliaria.status === 'ATIVO' ? 'Ativa' : 'Inativa'}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground">
                                            {formatCnpj(imobiliaria.cnpj)} · {imobiliaria.email} ·{' '}
                                            {imobiliaria._count.usuarios}{' '}
                                            usuário(s)
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => iniciarEdicao(imobiliaria)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant={imobiliaria.status === 'ATIVO' ? 'destructive' : 'outline'}
                                            size="sm"
                                            disabled={atualizarMutation.isPending}
                                            onClick={() =>
                                                atualizarMutation.mutate({
                                                    id: imobiliaria.id,
                                                    input: {
                                                        status:
                                                            imobiliaria.status === 'ATIVO' ? 'INATIVO' : 'ATIVO'
                                                    }
                                                })
                                            }
                                        >
                                            {atualizarMutation.isPending &&
                                                atualizarMutation.variables?.id === imobiliaria.id && (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                )}
                                            {imobiliaria.status === 'ATIVO' ? 'Excluir' : 'Reativar'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
