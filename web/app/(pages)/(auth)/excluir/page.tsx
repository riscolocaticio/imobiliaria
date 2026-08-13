'use client'

import { useMutation } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CpfSearchCard } from '@/components/cpf-search-card'
import { ocorrenciaService, OcorrenciaExcluivel } from '@/app/services/ocorrencia.service'
import { TIPO_OCORRENCIA_LABEL } from '@/shared/constants/tipo-ocorrencia'

export default function ExcluirPage() {
    const [registros, setRegistros] = useState<OcorrenciaExcluivel[] | null>(null)
    const [excluindoId, setExcluindoId] = useState<number | null>(null)

    const listarMutation = useMutation({
        mutationFn: (cpf: string) => ocorrenciaService.listarExcluiveis(cpf),
        onSuccess: setRegistros
    })

    const excluirMutation = useMutation({
        mutationFn: (id: number) => ocorrenciaService.excluir(id),
        onSuccess: (_data, id) => {
            setRegistros((atual) => atual?.filter((registro) => registro.id !== id) ?? null)
            setExcluindoId(null)
        }
    })

    return (
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[360px_1fr]">
            <CpfSearchCard
                icon={Trash2}
                title="Excluir informações"
                description="Consulte o CPF da sua imobiliária"
                isPending={listarMutation.isPending}
                onSubmit={(cpf) => listarMutation.mutate(cpf)}
            />

            {registros ? (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {registros.length === 0
                                ? 'Nenhum registro administrável por sua imobiliária'
                                : 'Registros da sua imobiliária'}
                        </CardTitle>
                    </CardHeader>
                    {registros.length > 0 && (
                        <CardContent className="flex flex-col gap-3">
                            {registros.map((registro) => (
                                <div
                                    key={registro.id}
                                    className="flex flex-col gap-4 rounded-md border border-border p-4 text-sm md:grid md:grid-cols-[1fr_auto] md:items-center"
                                >
                                    <div className="flex flex-col gap-2 md:grid md:grid-cols-[200px_1fr] md:items-center md:gap-4">
                                        <div>
                                            <p className="font-medium">
                                                {TIPO_OCORRENCIA_LABEL[registro.tipo]}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {new Date(registro.createdAt).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                        <p className="text-muted-foreground">{registro.descricao}</p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="w-full md:w-auto"
                                        disabled={excluirMutation.isPending && excluindoId === registro.id}
                                        onClick={() => {
                                            setExcluindoId(registro.id)
                                            excluirMutation.mutate(registro.id)
                                        }}
                                    >
                                        {excluirMutation.isPending && excluindoId === registro.id
                                            ? 'Excluindo...'
                                            : 'Excluir'}
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    )}
                </Card>
            ) : (
                <Card className="flex min-h-[220px] items-center justify-center border-dashed p-6 lg:min-h-[280px]">
                    <p className="max-w-xs text-center text-sm text-muted-foreground">
                        Informe um CPF para ver os registros administráveis pela sua imobiliária
                    </p>
                </Card>
            )}
        </div>
    )
}
