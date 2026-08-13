'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CnpjInput } from '@/components/ui/cnpj-input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCnpj, isCnpjComplete } from '@/lib/format-cnpj'
import { getErrorMessage } from '@/lib/get-error-message'
import { useDelayedLoading } from '@/lib/use-delayed-loading'
import {
    imobiliariaService,
    ImobiliariaComContagem
} from '@/app/services/imobiliaria.service'

const criarSchema = z.object({
    razaoSocial: z.string().min(1, 'Informe a razão social'),
    nomeFantasia: z.string().optional(),
    cnpj: z.string().refine(isCnpjComplete, 'Informe um CNPJ válido'),
    email: z.string().email('E-mail inválido')
})

const editarSchema = z.object({
    razaoSocial: z.string().min(1, 'Informe a razão social'),
    nomeFantasia: z.string().optional(),
    email: z.string().email('E-mail inválido')
})

type CriarFormValues = z.infer<typeof criarSchema>
type EditarFormValues = z.infer<typeof editarSchema>

export function ImobiliariasTab() {
    const [dialogCriarAberto, setDialogCriarAberto] = useState(false)
    const [imobiliariaEditando, setImobiliariaEditando] = useState<ImobiliariaComContagem | null>(null)
    const queryClient = useQueryClient()

    const { data: imobiliarias } = useQuery({
        queryKey: ['admin-imobiliarias'],
        queryFn: () => imobiliariaService.listar()
    })

    const formCriar = useForm<CriarFormValues>({
        resolver: zodResolver(criarSchema),
        defaultValues: { razaoSocial: '', nomeFantasia: '', cnpj: '', email: '' }
    })

    const formEditar = useForm<EditarFormValues>({
        resolver: zodResolver(editarSchema),
        defaultValues: { razaoSocial: '', nomeFantasia: '', email: '' }
    })

    const criarMutation = useMutation({
        mutationFn: (values: CriarFormValues) => imobiliariaService.criar(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-imobiliarias'] })
            toast.success('Imobiliária criada com sucesso.')
            formCriar.reset()
            setDialogCriarAberto(false)
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
            setImobiliariaEditando(null)
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Não foi possível atualizar a imobiliária.'))
        }
    })

    const mostrarCarregandoCriar = useDelayedLoading(criarMutation.isPending)
    const mostrarCarregandoAtualizar = useDelayedLoading(atualizarMutation.isPending)

    function iniciarEdicao(imobiliaria: ImobiliariaComContagem) {
        formEditar.reset({
            razaoSocial: imobiliaria.razaoSocial,
            nomeFantasia: imobiliaria.nomeFantasia ?? '',
            email: imobiliaria.email
        })
        setImobiliariaEditando(imobiliaria)
    }

    return (
        <Card className="flex h-full min-h-0 flex-col overflow-hidden">
            <CardHeader className="shrink-0 flex-row items-center justify-between gap-4 space-y-0">
                <div>
                    <CardTitle>Imobiliárias cadastradas</CardTitle>
                    <CardDescription>{imobiliarias?.length ?? 0} imobiliária(s)</CardDescription>
                </div>
                <Button onClick={() => setDialogCriarAberto(true)}>
                    <Plus className="h-4 w-4" />
                    Nova imobiliária
                </Button>
            </CardHeader>

            <CardContent className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
                {imobiliarias?.map((imobiliaria) => (
                    <div
                        key={imobiliaria.id}
                        className="flex flex-col gap-2 rounded-md border border-border p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-2 font-medium">
                                {imobiliaria.nomeFantasia ?? imobiliaria.razaoSocial}
                                <Badge variant={imobiliaria.status === 'ATIVO' ? 'default' : 'outline'}>
                                    {imobiliaria.status === 'ATIVO' ? 'Ativa' : 'Inativa'}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                {formatCnpj(imobiliaria.cnpj)} · {imobiliaria.email} · {imobiliaria._count.usuarios}{' '}
                                usuário(s)
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => iniciarEdicao(imobiliaria)}>
                                Editar
                            </Button>
                            <Button
                                variant={imobiliaria.status === 'ATIVO' ? 'destructive' : 'outline'}
                                size="sm"
                                disabled={atualizarMutation.isPending}
                                onClick={() =>
                                    atualizarMutation.mutate({
                                        id: imobiliaria.id,
                                        input: { status: imobiliaria.status === 'ATIVO' ? 'INATIVO' : 'ATIVO' }
                                    })
                                }
                            >
                                {mostrarCarregandoAtualizar &&
                                    atualizarMutation.variables?.id === imobiliaria.id && (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    )}
                                {imobiliaria.status === 'ATIVO' ? 'Excluir' : 'Reativar'}
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>

            <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nova imobiliária</DialogTitle>
                    </DialogHeader>
                    <form
                        className="flex flex-col gap-4"
                        noValidate
                        onSubmit={formCriar.handleSubmit((values) => criarMutation.mutate(values))}
                    >
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="razaoSocial" required>
                                Razão social
                            </Label>
                            <Input id="razaoSocial" {...formCriar.register('razaoSocial')} />
                            {formCriar.formState.errors.razaoSocial && (
                                <p className="text-xs text-destructive">
                                    {formCriar.formState.errors.razaoSocial.message}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="nomeFantasia">Nome fantasia</Label>
                            <Input id="nomeFantasia" {...formCriar.register('nomeFantasia')} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="cnpj" required>
                                CNPJ
                            </Label>
                            <CnpjInput id="cnpj" {...formCriar.register('cnpj')} />
                            {formCriar.formState.errors.cnpj && (
                                <p className="text-xs text-destructive">
                                    {formCriar.formState.errors.cnpj.message}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="email" required>
                                E-mail
                            </Label>
                            <Input id="email" type="email" {...formCriar.register('email')} />
                            {formCriar.formState.errors.email && (
                                <p className="text-xs text-destructive">
                                    {formCriar.formState.errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={criarMutation.isPending}>
                                {mostrarCarregandoCriar && <Loader2 className="h-4 w-4 animate-spin" />}
                                {mostrarCarregandoCriar ? 'Salvando...' : 'Salvar imobiliária'}
                            </Button>
                            <Button type="button" variant="ghost" onClick={() => setDialogCriarAberto(false)}>
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={imobiliariaEditando !== null}
                onOpenChange={(open) => !open && setImobiliariaEditando(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar imobiliária</DialogTitle>
                    </DialogHeader>
                    <form
                        className="flex flex-col gap-4"
                        noValidate
                        onSubmit={formEditar.handleSubmit((values) => {
                            if (imobiliariaEditando) {
                                atualizarMutation.mutate({ id: imobiliariaEditando.id, input: values })
                            }
                        })}
                    >
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="razaoSocial-editar" required>
                                Razão social
                            </Label>
                            <Input id="razaoSocial-editar" {...formEditar.register('razaoSocial')} />
                            {formEditar.formState.errors.razaoSocial && (
                                <p className="text-xs text-destructive">
                                    {formEditar.formState.errors.razaoSocial.message}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="nomeFantasia-editar">Nome fantasia</Label>
                            <Input id="nomeFantasia-editar" {...formEditar.register('nomeFantasia')} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="email-editar" required>
                                E-mail
                            </Label>
                            <Input id="email-editar" type="email" {...formEditar.register('email')} />
                            {formEditar.formState.errors.email && (
                                <p className="text-xs text-destructive">
                                    {formEditar.formState.errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={atualizarMutation.isPending}>
                                {mostrarCarregandoAtualizar && <Loader2 className="h-4 w-4 animate-spin" />}
                                {mostrarCarregandoAtualizar ? 'Salvando...' : 'Salvar'}
                            </Button>
                            <Button type="button" variant="ghost" onClick={() => setImobiliariaEditando(null)}>
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
