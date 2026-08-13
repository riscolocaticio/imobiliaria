'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CpfInput } from '@/components/ui/cpf-input'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { isCpfComplete } from '@/lib/format-cpf'
import { imobiliariaService } from '@/app/services/imobiliaria.service'
import { usuarioService } from '@/app/services/usuario.service'

const usuarioSchema = z.object({
    imobiliariaId: z.string().min(1, 'Selecione a imobiliária'),
    nomeCompleto: z.string().min(1, 'Informe o nome completo'),
    cpf: z.string().refine(isCpfComplete, 'Informe um CPF válido'),
    dataNascimento: z.string().min(1, 'Informe a data de nascimento'),
    email: z.string().email('E-mail inválido'),
    login: z.string().min(1, 'Informe o login'),
    password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres')
})

type UsuarioFormValues = z.infer<typeof usuarioSchema>

const TODAS_IMOBILIARIAS = 'todas'

export function UsuariosTab() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [filtroImobiliaria, setFiltroImobiliaria] = useState<string>(TODAS_IMOBILIARIAS)
    const [editandoId, setEditandoId] = useState<number | null>(null)
    const [edicao, setEdicao] = useState({
        nomeCompleto: '',
        email: '',
        imobiliariaId: '',
        password: ''
    })
    const queryClient = useQueryClient()

    const { data: imobiliarias } = useQuery({
        queryKey: ['admin-imobiliarias'],
        queryFn: () => imobiliariaService.listar()
    })

    const imobiliariaIdFiltro =
        filtroImobiliaria === TODAS_IMOBILIARIAS ? undefined : Number(filtroImobiliaria)

    const { data: usuarios } = useQuery({
        queryKey: ['admin-usuarios', imobiliariaIdFiltro],
        queryFn: () => usuarioService.listar(imobiliariaIdFiltro)
    })

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UsuarioFormValues>({
        resolver: zodResolver(usuarioSchema),
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

    const criarMutation = useMutation({
        mutationFn: (values: UsuarioFormValues) =>
            usuarioService.criar({ ...values, imobiliariaId: Number(values.imobiliariaId) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] })
            queryClient.invalidateQueries({ queryKey: ['admin-imobiliarias'] })
            reset()
            setMostrarFormulario(false)
        }
    })

    const erroCriar = isAxiosError<{ message?: string }>(criarMutation.error)
        ? criarMutation.error.response?.data?.message
        : null

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: 'ATIVO' | 'INATIVO' }) =>
            usuarioService.atualizarStatus(id, status),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] })
    })

    const erroStatus = isAxiosError<{ message?: string }>(statusMutation.error)
        ? statusMutation.error.response?.data?.message
        : null

    const atualizarMutation = useMutation({
        mutationFn: ({ id, imobiliariaId, password, ...resto }: typeof edicao & { id: number }) =>
            usuarioService.atualizar(id, {
                ...resto,
                imobiliariaId: Number(imobiliariaId),
                password: password || undefined
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] })
            queryClient.invalidateQueries({ queryKey: ['admin-imobiliarias'] })
            setEditandoId(null)
        }
    })

    const erroAtualizar = isAxiosError<{ message?: string }>(atualizarMutation.error)
        ? atualizarMutation.error.response?.data?.message
        : null

    function iniciarEdicao(usuario: NonNullable<typeof usuarios>[number]) {
        setEditandoId(usuario.id)
        setEdicao({
            nomeCompleto: usuario.nomeCompleto,
            email: usuario.email,
            imobiliariaId: String(usuario.imobiliariaId ?? usuario.imobiliaria?.id ?? ''),
            password: ''
        })
    }

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Usuários</CardTitle>
                        <CardDescription>{usuarios?.length ?? 0} usuário(s)</CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Select value={filtroImobiliaria} onValueChange={setFiltroImobiliaria}>
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
                        <Button variant="outline" onClick={() => setMostrarFormulario((v) => !v)}>
                            {mostrarFormulario ? 'Cancelar' : 'Novo usuário'}
                        </Button>
                    </div>
                </CardHeader>

                {mostrarFormulario && (
                    <CardContent className="border-b border-border pb-6">
                        <form
                            className="flex flex-col gap-4"
                            noValidate
                            onSubmit={handleSubmit((values) => criarMutation.mutate(values))}
                        >
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="imobiliariaId" required>
                                    Imobiliária
                                </Label>
                                <Controller
                                    name="imobiliariaId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="imobiliariaId">
                                                <SelectValue placeholder="Selecione..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {imobiliarias?.map((imobiliaria) => (
                                                    <SelectItem
                                                        key={imobiliaria.id}
                                                        value={String(imobiliaria.id)}
                                                    >
                                                        {imobiliaria.nomeFantasia ?? imobiliaria.razaoSocial}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.imobiliariaId && (
                                    <p className="text-xs text-destructive">{errors.imobiliariaId.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="nomeCompleto" required>
                                        Nome completo
                                    </Label>
                                    <Input id="nomeCompleto" {...register('nomeCompleto')} />
                                    {errors.nomeCompleto && (
                                        <p className="text-xs text-destructive">{errors.nomeCompleto.message}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="cpf" required>
                                        CPF
                                    </Label>
                                    <CpfInput id="cpf" {...register('cpf')} />
                                    {errors.cpf && <p className="text-xs text-destructive">{errors.cpf.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="dataNascimento" required>
                                        Data de nascimento
                                    </Label>
                                    <Controller
                                        name="dataNascimento"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                id="dataNascimento"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    {errors.dataNascimento && (
                                        <p className="text-xs text-destructive">
                                            {errors.dataNascimento.message}
                                        </p>
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

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="login" required>
                                        Usuário
                                    </Label>
                                    <Input id="login" {...register('login')} />
                                    {errors.login && (
                                        <p className="text-xs text-destructive">{errors.login.message}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="password" required>
                                        Senha
                                    </Label>
                                    <Input id="password" type="password" {...register('password')} />
                                    {errors.password && (
                                        <p className="text-xs text-destructive">{errors.password.message}</p>
                                    )}
                                </div>
                            </div>

                            {erroCriar && <p className="text-sm text-destructive">{erroCriar}</p>}

                            <Button type="submit" className="w-fit" disabled={criarMutation.isPending}>
                                {criarMutation.isPending ? 'Salvando...' : 'Salvar usuário'}
                            </Button>
                        </form>
                    </CardContent>
                )}

                <CardContent className="flex flex-col gap-3 pt-6">
                    {erroStatus && <p className="text-sm text-destructive">{erroStatus}</p>}
                    {erroAtualizar && <p className="text-sm text-destructive">{erroAtualizar}</p>}

                    {usuarios?.map((usuario) =>
                        editandoId === usuario.id ? (
                            <div
                                key={usuario.id}
                                className="flex flex-col gap-3 rounded-md border border-border p-4 text-sm"
                            >
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor={`nomeCompleto-${usuario.id}`}>Nome completo</Label>
                                        <Input
                                            id={`nomeCompleto-${usuario.id}`}
                                            value={edicao.nomeCompleto}
                                            onChange={(e) =>
                                                setEdicao((v) => ({ ...v, nomeCompleto: e.target.value }))
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor={`email-${usuario.id}`}>E-mail</Label>
                                        <Input
                                            id={`email-${usuario.id}`}
                                            type="email"
                                            value={edicao.email}
                                            onChange={(e) => setEdicao((v) => ({ ...v, email: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor={`imobiliariaId-${usuario.id}`}>Imobiliária</Label>
                                        <Select
                                            value={edicao.imobiliariaId}
                                            onValueChange={(value) =>
                                                setEdicao((v) => ({ ...v, imobiliariaId: value }))
                                            }
                                        >
                                            <SelectTrigger id={`imobiliariaId-${usuario.id}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {imobiliarias?.map((imobiliaria) => (
                                                    <SelectItem
                                                        key={imobiliaria.id}
                                                        value={String(imobiliaria.id)}
                                                    >
                                                        {imobiliaria.nomeFantasia ?? imobiliaria.razaoSocial}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor={`password-${usuario.id}`}>
                                            Nova senha (opcional)
                                        </Label>
                                        <Input
                                            id={`password-${usuario.id}`}
                                            type="password"
                                            placeholder="Deixe em branco pra manter"
                                            value={edicao.password}
                                            onChange={(e) =>
                                                setEdicao((v) => ({ ...v, password: e.target.value }))
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        disabled={atualizarMutation.isPending}
                                        onClick={() => atualizarMutation.mutate({ id: usuario.id, ...edicao })}
                                    >
                                        {atualizarMutation.isPending ? 'Salvando...' : 'Salvar'}
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setEditandoId(null)}>
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        ) : (
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
                                        {usuario.role === 'MASTER' && <Badge variant="secondary">Master</Badge>}
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
                                        {usuario.status === 'ATIVO' ? 'Excluir' : 'Reativar'}
                                    </Button>
                                </div>
                            </div>
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
