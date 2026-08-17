'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useUser } from '@/app/providers/user-provider'
import { ContestacaoMasterView } from './_components/contestacao-master-view'
import { ContestacaoImobiliariaView } from './_components/contestacao-imobiliaria-view'

export default function ContestacaoPage() {
    return (
        <Suspense fallback={null}>
            <ContestacaoPageContent />
        </Suspense>
    )
}

function ContestacaoPageContent() {
    const { usuario, carregando } = useUser()
    const searchParams = useSearchParams()
    const contestacaoIdParam = searchParams.get('contestacaoId')
    const contestacaoIdParaAbrir = contestacaoIdParam ? Number(contestacaoIdParam) : null

    if (carregando || !usuario) {
        return null
    }

    return (
        <div className="flex h-full min-h-0 flex-col gap-6">
            <div className="shrink-0">
                <h1 className="text-2xl font-bold tracking-tight">Contestação</h1>
                <p className="text-sm text-muted-foreground">
                    {usuario.role === 'MASTER'
                        ? 'Informações relatadas por consumidores e acompanhe as respostas das imobiliárias'
                        : 'Acompanhe as contestações abertas contra a sua imobiliária e envie documentos comprobatórios'}
                </p>
            </div>

            <div className="min-h-0 flex-1">
                {usuario.role === 'MASTER' ? (
                    <ContestacaoMasterView contestacaoIdParaAbrir={contestacaoIdParaAbrir} />
                ) : (
                    <ContestacaoImobiliariaView contestacaoIdParaAbrir={contestacaoIdParaAbrir} />
                )}
            </div>
        </div>
    )
}
