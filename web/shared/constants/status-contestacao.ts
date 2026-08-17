export type StatusContestacao = 'ABERTA' | 'RESPONDIDA' | 'PROCEDENTE' | 'IMPROCEDENTE' | 'EXPIRADA'

export const STATUS_CONTESTACAO_LABEL: Record<StatusContestacao, string> = {
    ABERTA: 'Aberta',
    RESPONDIDA: 'Respondida',
    PROCEDENTE: 'Procedente',
    IMPROCEDENTE: 'Improcedente',
    EXPIRADA: 'Expirada'
}

export const STATUS_CONTESTACAO_BADGE_CLASSNAME: Record<StatusContestacao, string> = {
    ABERTA: 'border-transparent bg-primary text-primary-foreground',
    RESPONDIDA: 'border-transparent bg-secondary text-secondary-foreground',
    PROCEDENTE: 'border-transparent bg-destructive text-destructive-foreground',
    IMPROCEDENTE: 'border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400',
    EXPIRADA: 'border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-400'
}
