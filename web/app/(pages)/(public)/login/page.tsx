'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FloatingField } from '@/components/ui/floating-field'
import { Input } from '@/components/ui/input'
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
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit'
    })

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
        <>
            <div className="flex flex-col items-center gap-3">
                <Image
                    src="/logo.png"
                    alt="Safeloc"
                    width={64}
                    height={64}
                    priority
                    className="h-16 w-16 rounded-2xl shadow-lg shadow-primary/25"
                />
                <div className="text-center">
                    <p className="text-2xl font-bold tracking-tight">
                        Safe<span className="text-primary">loc</span>
                    </p>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Locação segura para imobiliárias
                    </p>
                </div>
            </div>

            <Card className="w-full shadow-xl shadow-black/5">
                <CardHeader>
                    <CardTitle>Entrar</CardTitle>
                    <CardDescription>Acesso restrito a imobiliárias cadastradas</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <FloatingField label="Login" htmlFor="login" required error={errors.login?.message}>
                            <Input autoComplete="username" {...register('login')} />
                        </FloatingField>

                        <FloatingField
                            label="Senha"
                            htmlFor="password"
                            required
                            error={errors.password?.message}
                            trailing={
                                <button
                                    type="button"
                                    onClick={() => setMostrarSenha((valor) => !valor)}
                                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3 text-muted-foreground hover:text-foreground"
                                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                                >
                                    {mostrarSenha ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            }
                        >
                            <Input
                                type={mostrarSenha ? 'text' : 'password'}
                                autoComplete="current-password"
                                className="pr-10"
                                {...register('password')}
                            />
                        </FloatingField>

                        <Button type="submit" size="lg" disabled={enviando}>
                            {mostrarCarregando && <Loader2 className="h-4 w-4 animate-spin" />}
                            {mostrarCarregando ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}
