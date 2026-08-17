import { StatusContestacao } from '@prisma/client'

export type StatusContestacaoEfetivo = StatusContestacao | 'EXPIRADA'

export function calcularStatusEfetivo(contestacao: {
    status: StatusContestacao
    prazoLimite: Date
}): StatusContestacaoEfetivo {
    if (contestacao.status === 'ABERTA' && contestacao.prazoLimite.getTime() < Date.now()) {
        return 'EXPIRADA'
    }
    return contestacao.status
}
