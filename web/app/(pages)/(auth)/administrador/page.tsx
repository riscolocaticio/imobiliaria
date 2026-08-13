'use client'

import { Building2, FileClock, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUser } from '@/app/providers/user-provider'
import { ROUTES } from '@/shared/enums/routes.enum'
import { ImobiliariasTab } from './_components/imobiliarias-tab'
import { UsuariosTab } from './_components/usuarios-tab'
import { LogsTab } from './_components/logs-tab'

const ABAS = [
    { id: 'imobiliarias', label: 'Imobiliárias', icon: Building2 },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'logs', label: 'Logs', icon: FileClock }
] as const

type AbaId = (typeof ABAS)[number]['id']

export default function AdministradorPage() {
    const { usuario, carregando } = useUser()
    const router = useRouter()
    const [aba, setAba] = useState<AbaId>('imobiliarias')

    useEffect(() => {
        if (!carregando && usuario && usuario.role !== 'MASTER') {
            router.replace(ROUTES.CONSULTAR)
        }
    }, [carregando, usuario, router])

    if (carregando || !usuario || usuario.role !== 'MASTER') {
        return null
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Administrador</h1>
                <p className="text-sm text-muted-foreground">
                    Gerencie imobiliárias, usuários de qualquer imobiliária e acompanhe todos os
                    logs de auditoria da plataforma
                </p>
            </div>

            <div className="flex w-fit gap-1 rounded-lg border border-border bg-card p-1">
                {ABAS.map((item) => {
                    const Icon = item.icon
                    const ativa = aba === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => setAba(item.id)}
                            className={cn(
                                'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                ativa
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </button>
                    )
                })}
            </div>

            {aba === 'imobiliarias' && <ImobiliariasTab />}
            {aba === 'usuarios' && <UsuariosTab />}
            {aba === 'logs' && <LogsTab />}
        </div>
    )
}
