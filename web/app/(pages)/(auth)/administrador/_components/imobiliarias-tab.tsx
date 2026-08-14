'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Building2, Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CnpjInput } from '@/components/ui/cnpj-input'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FloatingField } from '@/components/ui/floating-field'
import { Input } from '@/components/ui/input'
import { ListagemCard } from '@/components/ui/listagem-card'
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
    const [imobiliariaParaDesativar, setImobiliariaParaDesativar] = useState<ImobiliariaComContagem | null>(
        null
    )
    const queryClient = useQueryClient()

    const { data: imobiliarias } = useQuery({
        queryKey: ['admin-imobiliarias'],
        queryFn: () => imobiliariaService.listar()
    })

    const formCriar = useForm<CriarFormValues>({
        resolver: zodResolver(criarSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        defaultValues: { razaoSocial: '', nomeFantasia: '', cnpj: '', email: '' }
    })

    const formEditar = useForm<EditarFormValues>({
        resolver: zodResolver(editarSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
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
            setImobiliariaParaDesativar(null)
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
        <>
            <ListagemCard
                title="Imobiliárias cadastradas"
                description={`${imobiliarias?.length ?? 0} imobiliária(s)`}
                isEmpty={imobiliarias?.length === 0}
                emptyIcon={Building2}
                emptyMessage="Nenhuma imobiliária cadastrada."
                headerActions={
                    <Button onClick={() => setDialogCriarAberto(true)}>
                        <Plus className="h-4 w-4" />
                        Nova imobiliária
                    </Button>
                }
            >
                {imobiliarias?.map((imobiliaria) => (
                    <div
                        key={imobiliaria.id}
                        className="flex flex-col gap-2 rounded-md border border-border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-2 font-medium">
                                {imobiliaria.nomeFantasia ?? imobiliaria.razaoSocial}
                                <Badge variant={imobiliaria.status === 'ATIVO' ? 'default' : 'outline'}>
                                    {imobiliaria.status === 'ATIVO' ? 'Ativa' : 'Inativa'}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                {formatCnpj(imobiliaria.cnpj)} · {imobiliaria.email} ·{' '}
                                {imobiliaria._count.usuarios === 0
                                    ? 'nenhum usuário'
                                    : `${imobiliaria._count.usuarios} usuário(s)`}
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
                                onClick={() => {
                                    if (imobiliaria.status === 'ATIVO') {
                                        setImobiliariaParaDesativar(imobiliaria)
                                    } else {
                                        atualizarMutation.mutate({
                                            id: imobiliaria.id,
                                            input: { status: 'ATIVO' }
                                        })
                                    }
                                }}
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
            </ListagemCard>

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
                        <FloatingField
                            label="Razão social"
                            htmlFor="razaoSocial"
                            required
                            error={formCriar.formState.errors.razaoSocial?.message}
                        >
                            <Input {...formCriar.register('razaoSocial')} />
                        </FloatingField>
                        <FloatingField label="Nome fantasia" htmlFor="nomeFantasia">
                            <Input {...formCriar.register('nomeFantasia')} />
                        </FloatingField>
                        <FloatingField
                            label="CNPJ"
                            htmlFor="cnpj"
                            required
                            error={formCriar.formState.errors.cnpj?.message}
                        >
                            <CnpjInput {...formCriar.register('cnpj')} />
                        </FloatingField>
                        <FloatingField
                            label="E-mail"
                            htmlFor="email"
                            required
                            error={formCriar.formState.errors.email?.message}
                        >
                            <Input type="email" autoComplete="off" {...formCriar.register('email')} />
                        </FloatingField>
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
                        <FloatingField
                            label="Razão social"
                            htmlFor="razaoSocial-editar"
                            required
                            error={formEditar.formState.errors.razaoSocial?.message}
                        >
                            <Input {...formEditar.register('razaoSocial')} />
                        </FloatingField>
                        <FloatingField label="Nome fantasia" htmlFor="nomeFantasia-editar">
                            <Input {...formEditar.register('nomeFantasia')} />
                        </FloatingField>
                        <FloatingField
                            label="E-mail"
                            htmlFor="email-editar"
                            required
                            error={formEditar.formState.errors.email?.message}
                        >
                            <Input type="email" autoComplete="off" {...formEditar.register('email')} />
                        </FloatingField>
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

            <ConfirmDialog
                open={imobiliariaParaDesativar !== null}
                onOpenChange={(open) => !open && setImobiliariaParaDesativar(null)}
                title="Excluir esta imobiliária?"
                description={
                    imobiliariaParaDesativar
                        ? `${imobiliariaParaDesativar.nomeFantasia ?? imobiliariaParaDesativar.razaoSocial} e seus usuários vão perder o acesso ao sistema até ser reativada.`
                        : undefined
                }
                confirmLabel="Sim, excluir"
                cancelLabel="Não"
                loading={mostrarCarregandoAtualizar}
                onConfirm={() => {
                    if (imobiliariaParaDesativar) {
                        atualizarMutation.mutate({
                            id: imobiliariaParaDesativar.id,
                            input: { status: 'INATIVO' }
                        })
                    }
                }}
            />
        </>
    )
}
