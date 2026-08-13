'use client'

import { useMutation } from '@tanstack/react-query'
import { FolderOpen, Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CpfSearchCard } from '@/components/cpf-search-card'
import { getErrorMessage } from '@/lib/get-error-message'
import { ocorrenciaService, OcorrenciaExcluivel } from '@/app/services/ocorrencia.service'
import { TIPO_OCORRENCIA_LABEL } from '@/shared/constants/tipo-ocorrencia'

export default function ExcluirPage() {
    const [registros, setRegistros] = useState<OcorrenciaExcluivel[] | null>(null)
    const [excluindoId, setExcluindoId] = useState<number | null>(null)

    const listarMutation = useMutation({
        mutationFn: (cpf: string) => ocorrenciaService.listarExcluiveis(cpf),
        onSuccess: setRegistros,
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Não foi possível consultar o CPF. Tente novamente.'))
        }
    })

    const excluirMutation = useMutation({
        mutationFn: (id: number) => ocorrenciaService.excluir(id),
        onSuccess: (_data, id) => {
            setRegistros((atual) => atual?.filter((registro) => registro.id !== id) ?? null)
            setExcluindoId(null)
            toast.success('Registro excluído com sucesso.')
        },
        onError: (error) => {
            setExcluindoId(null)
            toast.error(getErrorMessage(error, 'Não foi possível excluir o registro.'))
        }
    })

    return (
        <div className="grid h-full min-h-0 grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
            <div className="lg:self-start">
                <CpfSearchCard
                    icon={Trash2}
                    title="Excluir informações"
                    description="Consulte o CPF da sua imobiliária"
                    isPending={listarMutation.isPending}
                    onSubmit={(cpf) => listarMutation.mutate(cpf)}
                />
            </div>

            {registros ? (
                <Card className="flex h-full min-h-0 flex-col overflow-hidden">
                    <CardHeader className="shrink-0">
                        <CardTitle>
                            {registros.length === 0
                                ? 'Nenhum registro administrável por sua imobiliária'
                                : 'Registros da sua imobiliária'}
                        </CardTitle>
                    </CardHeader>
                    {registros.length > 0 && (
                        <CardContent className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
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
                                        {excluirMutation.isPending && excluindoId === registro.id && (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        )}
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
                <Card className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 border-dashed p-6">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <FolderOpen className="h-7 w-7 text-muted-foreground" />
                    </span>
                    <p className="max-w-xs text-center text-sm text-muted-foreground">
                        Informe um CPF ao lado para ver os registros administráveis pela sua imobiliária
                    </p>
                </Card>
            )}
        </div>
    )
}
