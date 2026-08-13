'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getErrorMessage } from '@/lib/get-error-message'
import { isCpfComplete } from '@/lib/format-cpf'
import { imobiliariaService } from '@/app/services/imobiliaria.service'
import { usuarioService } from '@/app/services/usuario.service'

const usuarioSchema = z.object({
    nomeCompleto: z.string().min(1, 'Informe o nome completo'),
    cpf: z.string().refine(isCpfComplete, 'Informe um CPF válido'),
    dataNascimento: z.string().min(1, 'Informe a data de nascimento'),
    email: z.string().email('E-mail inválido'),
    login: z.string().min(1, 'Informe o login'),
    password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres')
})

type UsuarioFormValues = z.infer<typeof usuarioSchema>

export default function UsuariosPage() {
    const [dialogAberto, setDialogAberto] = useState(false)
    const queryClient = useQueryClient()

    const { data: usuarios } = useQuery({
        queryKey: ['usuarios'],
        queryFn: () => usuarioService.listar()
    })

    const { data: imobiliariaAtual } = useQuery({
        queryKey: ['imobiliaria-me'],
        queryFn: () => imobiliariaService.me(),
        enabled: dialogAberto
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
            nomeCompleto: '',
            cpf: '',
            dataNascimento: '',
            email: '',
            login: '',
            password: ''
        }
    })

    const criarMutation = useMutation({
        mutationFn: (values: UsuarioFormValues) => usuarioService.criar(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usuarios'] })
            toast.success('Usuário criado com sucesso.')
            reset()
            setDialogAberto(false)
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Não foi possível criar o usuário. Verifique os dados e tente novamente.'))
        }
    })

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: 'ATIVO' | 'INATIVO' }) =>
            usuarioService.atualizarStatus(id, status),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['usuarios'] })
            toast.success(variables.status === 'ATIVO' ? 'Usuário reativado.' : 'Usuário desativado.')
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Não foi possível atualizar o usuário.'))
        }
    })

    const usuariosAtivos = usuarios?.filter((usuario) => usuario.status === 'ATIVO').length ?? 0

    return (
        <div className="flex h-full min-h-0 flex-col">
            <Card className="flex h-full min-h-0 flex-col overflow-hidden">
                <CardHeader className="shrink-0 flex-row flex-wrap items-center justify-between gap-4 space-y-0">
                    <div>
                        <CardTitle>Usuários da imobiliária</CardTitle>
                        <CardDescription>Cada imobiliária pode ter no máximo 2 usuários ativos</CardDescription>
                    </div>
                    {usuariosAtivos < 2 && (
                        <Button onClick={() => setDialogAberto(true)}>
                            <Plus className="h-4 w-4" />
                            Adicionar usuário
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
                    {usuarios?.map((usuario) => (
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
                                </div>
                                <p className="text-muted-foreground">
                                    {usuario.login} · {usuario.email}
                                </p>
                            </div>
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
                                {statusMutation.isPending && statusMutation.variables?.id === usuario.id && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                                {usuario.status === 'ATIVO' ? 'Desativar' : 'Reativar'}
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Novo usuário</DialogTitle>
                    </DialogHeader>
                    <form
                        className="flex flex-col gap-4"
                        noValidate
                        onSubmit={handleSubmit((values) => criarMutation.mutate(values))}
                    >
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="imobiliaria">Imobiliária</Label>
                            <Select
                                value={imobiliariaAtual ? String(imobiliariaAtual.id) : undefined}
                                onValueChange={() => {}}
                            >
                                <SelectTrigger id="imobiliaria">
                                    <SelectValue placeholder="Carregando..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {imobiliariaAtual && (
                                        <SelectItem value={String(imobiliariaAtual.id)}>
                                            {imobiliariaAtual.nomeFantasia ?? imobiliariaAtual.razaoSocial}
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Por enquanto, o usuário é sempre criado na sua própria imobiliária.
                            </p>
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
                                    <p className="text-xs text-destructive">{errors.dataNascimento.message}</p>
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

                        <div className="flex gap-2">
                            <Button type="submit" disabled={criarMutation.isPending}>
                                {criarMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                {criarMutation.isPending ? 'Salvando...' : 'Salvar'}
                            </Button>
                            <Button type="button" variant="ghost" onClick={() => setDialogAberto(false)}>
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
