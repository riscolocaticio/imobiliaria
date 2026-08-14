'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus, Users } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CpfInput } from '@/components/ui/cpf-input'
import { DatePicker } from '@/components/ui/date-picker'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FloatingField } from '@/components/ui/floating-field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getErrorMessage } from '@/lib/get-error-message'
import { isCpfComplete } from '@/lib/format-cpf'
import { useDelayedLoading } from '@/lib/use-delayed-loading'
import { imobiliariaService } from '@/app/services/imobiliaria.service'
import { usuarioService, Usuario } from '@/app/services/usuario.service'

const criarSchema = z.object({
    imobiliariaId: z.string().min(1, 'Selecione a imobiliária'),
    nomeCompleto: z.string().min(1, 'Informe o nome completo'),
    cpf: z.string().refine(isCpfComplete, 'Informe um CPF válido'),
    dataNascimento: z.string().min(1, 'Informe a data de nascimento'),
    email: z.string().email('E-mail inválido'),
    login: z.string().min(1, 'Informe o login'),
    password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres')
})

const editarSchema = z.object({
    imobiliariaId: z.string().min(1, 'Selecione a imobiliária'),
    nomeCompleto: z.string().min(1, 'Informe o nome completo'),
    email: z.string().email('E-mail inválido'),
    password: z.string().optional()
})

type CriarFormValues = z.infer<typeof criarSchema>
type EditarFormValues = z.infer<typeof editarSchema>

const TODAS_IMOBILIARIAS = 'todas'

export function UsuariosTab() {
    const [dialogCriarAberto, setDialogCriarAberto] = useState(false)
    const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null)
    const [filtroImobiliaria, setFiltroImobiliaria] = useState<string>(TODAS_IMOBILIARIAS)
    const queryClient = useQueryClient()

    const { data: imobiliarias } = useQuery({
        queryKey: ['admin-imobiliarias'],
        queryFn: () => imobiliariaService.listar()
    })

    const imobiliariaIdFiltro =
        filtroImobiliaria === TODAS_IMOBILIARIAS ? undefined : Number(filtroImobiliaria)

    const { data: usuarios, isFetching: isFetchingUsuarios } = useQuery({
        queryKey: ['admin-usuarios', imobiliariaIdFiltro],
        queryFn: () => usuarioService.listar(imobiliariaIdFiltro),
        placeholderData: keepPreviousData
    })

    const formCriar = useForm<CriarFormValues>({
        resolver: zodResolver(criarSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        defaultValues: {
            imobiliariaId: '',
            nomeCompleto: '',
            cpf: '',
            dataNascimento: '',
            email: '',
            login: '',
            password: ''
        }
    })

    const formEditar = useForm<EditarFormValues>({
        resolver: zodResolver(editarSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        defaultValues: { imobiliariaId: '', nomeCompleto: '', email: '', password: '' }
    })

    const criarMutation = useMutation({
        mutationFn: (values: CriarFormValues) =>
            usuarioService.criar({ ...values, imobiliariaId: Number(values.imobiliariaId) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] })
            queryClient.invalidateQueries({ queryKey: ['admin-imobiliarias'] })
            toast.success('Usuário criado com sucesso.')
            formCriar.reset()
            setDialogCriarAberto(false)
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Não foi possível criar o usuário. Verifique os dados e tente novamente.'))
        }
    })

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: 'ATIVO' | 'INATIVO' }) =>
            usuarioService.atualizarStatus(id, status),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] })
            toast.success(variables.status === 'ATIVO' ? 'Usuário reativado.' : 'Usuário desativado.')
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Não foi possível atualizar o usuário.'))
        }
    })

    const atualizarMutation = useMutation({
        mutationFn: ({ id, imobiliariaId, password, ...resto }: EditarFormValues & { id: number }) =>
            usuarioService.atualizar(id, {
                ...resto,
                imobiliariaId: Number(imobiliariaId),
                password: password || undefined
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] })
            queryClient.invalidateQueries({ queryKey: ['admin-imobiliarias'] })
            toast.success('Usuário atualizado com sucesso.')
            setUsuarioEditando(null)
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Não foi possível atualizar o usuário.'))
        }
    })

    const mostrarCarregandoCriar = useDelayedLoading(criarMutation.isPending)
    const mostrarCarregandoStatus = useDelayedLoading(statusMutation.isPending)
    const mostrarCarregandoAtualizar = useDelayedLoading(atualizarMutation.isPending)
    const mostrarCarregandoFiltro = useDelayedLoading(isFetchingUsuarios)

    function iniciarEdicao(usuario: Usuario) {
        formEditar.reset({
            nomeCompleto: usuario.nomeCompleto,
            email: usuario.email,
            imobiliariaId: String(usuario.imobiliariaId ?? usuario.imobiliaria?.id ?? ''),
            password: ''
        })
        setUsuarioEditando(usuario)
    }

    return (
        <Card className="flex h-full min-h-0 flex-col overflow-hidden">
            <CardHeader className="shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle>Usuários</CardTitle>
                    <CardDescription>{usuarios?.length ?? 0} usuário(s)</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Select
                            value={filtroImobiliaria}
                            onValueChange={setFiltroImobiliaria}
                            disabled={mostrarCarregandoFiltro}
                        >
                            <SelectTrigger className="w-56">
                                <SelectValue placeholder="Filtrar por imobiliária" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={TODAS_IMOBILIARIAS}>Todas as imobiliárias</SelectItem>
                                {imobiliarias?.map((imobiliaria) => (
                                    <SelectItem key={imobiliaria.id} value={String(imobiliaria.id)}>
                                        {imobiliaria.nomeFantasia ?? imobiliaria.razaoSocial}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {mostrarCarregandoFiltro && (
                            <Loader2 className="pointer-events-none absolute right-8 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                        )}
                    </div>
                    <Button onClick={() => setDialogCriarAberto(true)}>
                        <Plus className="h-4 w-4" />
                        Novo usuário
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
                {usuarios && usuarios.length === 0 && (
                    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                            <Users className="h-7 w-7 text-muted-foreground" />
                        </span>
                        <p className="max-w-xs text-center text-sm text-muted-foreground">
                            Nenhum usuário encontrado com esse filtro.
                        </p>
                    </div>
                )}

                {usuarios && usuarios.length > 0 && (
                    <div className="scroll-fade-y flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
                        {usuarios.map((usuario) => (
                            <div
                                key={usuario.id}
                                className="flex flex-col gap-2 rounded-md border border-border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-2 font-medium">
                                        {usuario.nomeCompleto}
                                        <Badge variant={usuario.status === 'ATIVO' ? 'default' : 'outline'}>
                                            {usuario.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                        {usuario.role === 'MASTER' && (
                                            <Badge variant="secondary">Master</Badge>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground">
                                        {usuario.login} · {usuario.email}
                                        {usuario.imobiliaria &&
                                            ` · ${usuario.imobiliaria.nomeFantasia ?? usuario.imobiliaria.razaoSocial}`}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => iniciarEdicao(usuario)}>
                                        Editar
                                    </Button>
                                    {usuario.role !== 'MASTER' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={statusMutation.isPending}
                                            onClick={() =>
                                                statusMutation.mutate({
                                                    id: usuario.id,
                                                    status: usuario.status === 'ATIVO' ? 'INATIVO' : 'ATIVO'
                                                })
                                            }
                                        >
                                            {mostrarCarregandoStatus &&
                                                statusMutation.variables?.id === usuario.id && (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                )}
                                            {usuario.status === 'ATIVO' ? 'Excluir' : 'Reativar'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Novo usuário</DialogTitle>
                    </DialogHeader>
                    <form
                        className="flex flex-col gap-4"
                        noValidate
                        onSubmit={formCriar.handleSubmit((values) => criarMutation.mutate(values))}
                    >
                        <div className="flex flex-col gap-1.5">
                            <Controller
                                name="imobiliariaId"
                                control={formCriar.control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger id="imobiliariaId">
                                            <SelectValue placeholder="Imobiliária" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {imobiliarias?.map((imobiliaria) => (
                                                <SelectItem key={imobiliaria.id} value={String(imobiliaria.id)}>
                                                    {imobiliaria.nomeFantasia ?? imobiliaria.razaoSocial}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {formCriar.formState.errors.imobiliariaId && (
                                <p className="text-xs text-destructive">
                                    {formCriar.formState.errors.imobiliariaId.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FloatingField
                                label="Nome completo"
                                htmlFor="nomeCompleto"
                                required
                                error={formCriar.formState.errors.nomeCompleto?.message}
                            >
                                <Input {...formCriar.register('nomeCompleto')} />
                            </FloatingField>
                            <FloatingField
                                label="CPF"
                                htmlFor="cpf"
                                required
                                error={formCriar.formState.errors.cpf?.message}
                            >
                                <CpfInput {...formCriar.register('cpf')} />
                            </FloatingField>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Controller
                                    name="dataNascimento"
                                    control={formCriar.control}
                                    render={({ field }) => (
                                        <DatePicker
                                            id="dataNascimento"
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Data de nascimento"
                                        />
                                    )}
                                />
                                {formCriar.formState.errors.dataNascimento && (
                                    <p className="text-xs text-destructive">
                                        {formCriar.formState.errors.dataNascimento.message}
                                    </p>
                                )}
                            </div>
                            <FloatingField
                                label="E-mail"
                                htmlFor="email"
                                required
                                error={formCriar.formState.errors.email?.message}
                            >
                                <Input type="email" {...formCriar.register('email')} />
                            </FloatingField>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FloatingField
                                label="Usuário"
                                htmlFor="login"
                                required
                                error={formCriar.formState.errors.login?.message}
                            >
                                <Input {...formCriar.register('login')} />
                            </FloatingField>
                            <FloatingField
                                label="Senha"
                                htmlFor="password"
                                required
                                error={formCriar.formState.errors.password?.message}
                            >
                                <Input type="password" {...formCriar.register('password')} />
                            </FloatingField>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={criarMutation.isPending}>
                                {mostrarCarregandoCriar && <Loader2 className="h-4 w-4 animate-spin" />}
                                {mostrarCarregandoCriar ? 'Salvando...' : 'Salvar usuário'}
                            </Button>
                            <Button type="button" variant="ghost" onClick={() => setDialogCriarAberto(false)}>
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={usuarioEditando !== null} onOpenChange={(open) => !open && setUsuarioEditando(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar usuário</DialogTitle>
                    </DialogHeader>
                    <form
                        className="flex flex-col gap-4"
                        noValidate
                        onSubmit={formEditar.handleSubmit((values) => {
                            if (usuarioEditando) {
                                atualizarMutation.mutate({ id: usuarioEditando.id, ...values })
                            }
                        })}
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FloatingField
                                label="Nome completo"
                                htmlFor="nomeCompleto-editar"
                                error={formEditar.formState.errors.nomeCompleto?.message}
                            >
                                <Input {...formEditar.register('nomeCompleto')} />
                            </FloatingField>
                            <FloatingField
                                label="E-mail"
                                htmlFor="email-editar"
                                error={formEditar.formState.errors.email?.message}
                            >
                                <Input type="email" {...formEditar.register('email')} />
                            </FloatingField>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Controller
                                    name="imobiliariaId"
                                    control={formEditar.control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="imobiliariaId-editar">
                                                <SelectValue placeholder="Imobiliária" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {imobiliarias?.map((imobiliaria) => (
                                                    <SelectItem key={imobiliaria.id} value={String(imobiliaria.id)}>
                                                        {imobiliaria.nomeFantasia ?? imobiliaria.razaoSocial}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <FloatingField label="Nova senha (opcional)" htmlFor="password-editar">
                                <Input
                                    type="password"
                                    placeholder="Deixe em branco pra manter"
                                    {...formEditar.register('password')}
                                />
                            </FloatingField>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={atualizarMutation.isPending}>
                                {mostrarCarregandoAtualizar && <Loader2 className="h-4 w-4 animate-spin" />}
                                {mostrarCarregandoAtualizar ? 'Salvando...' : 'Salvar'}
                            </Button>
                            <Button type="button" variant="ghost" onClick={() => setUsuarioEditando(null)}>
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
