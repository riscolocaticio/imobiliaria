'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CpfInput } from '@/components/ui/cpf-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isCpfComplete } from '@/lib/format-cpf'
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
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const queryClient = useQueryClient()

    const { data: usuarios } = useQuery({
        queryKey: ['usuarios'],
        queryFn: () => usuarioService.listar()
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UsuarioFormValues>({ resolver: zodResolver(usuarioSchema) })

    const criarMutation = useMutation({
        mutationFn: (values: UsuarioFormValues) => usuarioService.criar(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usuarios'] })
            reset()
            setMostrarFormulario(false)
        }
    })

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: 'ACTIVE' | 'INACTIVE' }) =>
            usuarioService.atualizarStatus(id, status),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    })

    const usuariosAtivos = usuarios?.filter((usuario) => usuario.status === 'ACTIVE').length ?? 0

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Usuários da imobiliária</CardTitle>
                    <CardDescription>Cada imobiliária pode ter no máximo 2 usuários ativos</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    {usuarios?.map((usuario) => (
                        <div
                            key={usuario.id}
                            className="flex flex-col gap-2 rounded-md border border-border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <div className="flex items-center gap-2 font-medium">
                                    {usuario.nomeCompleto}
                                    <Badge variant={usuario.status === 'ACTIVE' ? 'default' : 'outline'}>
                                        {usuario.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
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
                                        status: usuario.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                                    })
                                }
                            >
                                {usuario.status === 'ACTIVE' ? 'Desativar' : 'Reativar'}
                            </Button>
                        </div>
                    ))}

                    {!mostrarFormulario && usuariosAtivos < 2 && (
                        <Button variant="outline" onClick={() => setMostrarFormulario(true)}>
                            Adicionar usuário
                        </Button>
                    )}
                </CardContent>
            </Card>

            {mostrarFormulario && (
                <Card>
                    <CardHeader>
                        <CardTitle>Novo usuário</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={handleSubmit((values) => criarMutation.mutate(values))}
                        >
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

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="dataNascimento" required>
                                    Data de nascimento
                                </Label>
                                <Input id="dataNascimento" type="date" {...register('dataNascimento')} />
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

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="login" required>
                                    Login
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

                            {criarMutation.isError && (
                                <p className="text-sm text-destructive">
                                    Não foi possível criar o usuário. Verifique os dados e tente novamente.
                                </p>
                            )}

                            <div className="flex gap-2">
                                <Button type="submit" disabled={criarMutation.isPending}>
                                    {criarMutation.isPending ? 'Salvando...' : 'Salvar'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setMostrarFormulario(false)}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
