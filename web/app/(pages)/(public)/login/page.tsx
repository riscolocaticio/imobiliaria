'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/app/services/auth.service'
import { useDelayedLoading } from '@/lib/use-delayed-loading'
import { ROUTES } from '@/shared/enums/routes.enum'

const loginSchema = z.object({
    login: z.string().min(1, 'Informe o login'),
    password: z.string().min(1, 'Informe a senha')
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    )
}

function LoginForm() {
    const [enviando, setEnviando] = useState(false)
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const searchParams = useSearchParams()
    const mostrarCarregando = useDelayedLoading(enviando)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

    async function onSubmit(values: LoginFormValues) {
        setEnviando(true)
        try {
            await authService.login(values.login, values.password)
            const returnTo = searchParams.get('returnTo')
            window.location.href = returnTo || ROUTES.CONSULTAR
        } catch {
            toast.error('Login ou senha incorretos')
            setEnviando(false)
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Plataforma de Risco Locatício</CardTitle>
                <CardDescription>Acesso restrito a imobiliárias cadastradas</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="login" required>
                            Login
                        </Label>
                        <Input id="login" autoComplete="username" {...register('login')} />
                        {errors.login && (
                            <p className="text-xs text-destructive">{errors.login.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="password" required>
                            Senha
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={mostrarSenha ? 'text' : 'password'}
                                autoComplete="current-password"
                                className="pr-10"
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarSenha((valor) => !valor)}
                                className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3 text-muted-foreground hover:text-foreground"
                                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                            >
                                {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    <Button type="submit" size="lg" disabled={enviando}>
                        {mostrarCarregando && <Loader2 className="h-4 w-4 animate-spin" />}
                        {mostrarCarregando ? 'Entrando...' : 'Entrar'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
