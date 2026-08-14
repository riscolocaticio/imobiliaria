'use client'

import { useMutation } from '@tanstack/react-query'
import { Clock, FolderOpen, Inbox, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { CpfSearchCard } from '@/components/cpf-search-card'
import { getErrorMessage } from '@/lib/get-error-message'
import { useDelayedLoading } from '@/lib/use-delayed-loading'
import { ocorrenciaService, OcorrenciaExcluivel } from '@/app/services/ocorrencia.service'
import { TIPO_OCORRENCIA_ICON, TIPO_OCORRENCIA_LABEL } from '@/shared/constants/tipo-ocorrencia'

export default function ExcluirPage() {
    const [registros, setRegistros] = useState<OcorrenciaExcluivel[] | null>(null)
    const [registroParaExcluir, setRegistroParaExcluir] = useState<OcorrenciaExcluivel | null>(null)

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
            setRegistroParaExcluir(null)
            toast.success('Registro excluído com sucesso.')
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Não foi possível excluir o registro.'))
        }
    })

    const mostrarCarregandoExclusao = useDelayedLoading(excluirMutation.isPending)

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
                        {registros.length > 0 && (
                            <CardDescription>{registros.length} registro(s) encontrado(s)</CardDescription>
                        )}
                    </CardHeader>
                    {registros.length === 0 && (
                        <CardContent className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3">
                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                <Inbox className="h-7 w-7 text-muted-foreground" />
                            </span>
                            <p className="max-w-xs text-center text-sm text-muted-foreground">
                                Nenhuma ocorrência registrada por sua imobiliária foi encontrada para esse CPF.
                            </p>
                        </CardContent>
                    )}

                    {registros.length > 0 && (
                        <CardContent className="scroll-fade-y flex min-h-0 flex-1 flex-col overflow-y-auto">
                            <ul className="flex flex-col gap-4">
                                {registros.map((registro) => {
                                    const Icon = TIPO_OCORRENCIA_ICON[registro.tipo]
                                    return (
                                        <li
                                            key={registro.id}
                                            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            <div className="flex items-start gap-4">
                                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                                    <Icon className="h-5 w-5" />
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <Badge variant="secondary">
                                                            {TIPO_OCORRENCIA_LABEL[registro.tipo]}
                                                        </Badge>
                                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Clock className="h-3 w-3" />
                                                            {new Date(registro.createdAt).toLocaleDateString(
                                                                'pt-BR'
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="mt-3 text-sm leading-relaxed text-foreground">
                                                        {registro.descricao}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="w-full"
                                                onClick={() => setRegistroParaExcluir(registro)}
                                            >
                                                Excluir
                                            </Button>
                                        </li>
                                    )
                                })}
                            </ul>
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

            <ConfirmDialog
                open={registroParaExcluir !== null}
                onOpenChange={(open) => !open && setRegistroParaExcluir(null)}
                title="Excluir este registro?"
                description={
                    registroParaExcluir
                        ? `A ocorrência de "${TIPO_OCORRENCIA_LABEL[registroParaExcluir.tipo]}" será excluída. Essa ação não pode ser desfeita.`
                        : undefined
                }
                confirmLabel="Sim, excluir"
                cancelLabel="Não"
                loading={mostrarCarregandoExclusao}
                onConfirm={() => {
                    if (registroParaExcluir) {
                        excluirMutation.mutate(registroParaExcluir.id)
                    }
                }}
            />
        </div>
    )
}
