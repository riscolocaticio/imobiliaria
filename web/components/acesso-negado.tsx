'use client'

import { useRouter } from 'next/navigation'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/shared/enums/routes.enum'

export function AcessoNegado() {
    const router = useRouter()

    return (
        <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <ShieldAlert className="h-8 w-8" />
            </span>

            <div className="flex flex-col gap-1">
                <h1 className="text-lg font-bold tracking-tight">Você não tem permissão para acessar esta página</h1>
                <p className="text-sm text-muted-foreground">
                    Fale com o administrador da sua imobiliária caso precise desse acesso.
                </p>
            </div>

            <Button onClick={() => router.replace(ROUTES.CONSULTAR)}>Voltar para Consultar Ocorrências</Button>
        </div>
    )
}
