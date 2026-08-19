'use client'

import { AcessoNegado } from '@/components/acesso-negado'
import { AppLoading } from '@/components/app-loading'
import { useUser } from '@/app/providers/user-provider'

export function RequirePapelAdmin({ children }: { children: React.ReactNode }) {
    const { usuario, carregando } = useUser()

    if (carregando || !usuario) {
        return <AppLoading />
    }

    if (usuario.role === 'IMOBILIARIA' && usuario.papel === 'PADRAO') {
        return <AcessoNegado />
    }

    return <>{children}</>
}
