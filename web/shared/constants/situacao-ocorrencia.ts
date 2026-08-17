export const SITUACAO_OCORRENCIA_OPTIONS = [
    { value: 'EM_ABERTO', label: 'Em aberto' },
    { value: 'EM_COBRANCA', label: 'Em cobrança' },
    { value: 'EM_NEGOCIACAO', label: 'Em negociação' },
    { value: 'EM_PROCESSO_JUDICIAL', label: 'Em processo judicial' }
] as const

export type SituacaoOcorrencia = (typeof SITUACAO_OCORRENCIA_OPTIONS)[number]['value']

export const SITUACAO_OCORRENCIA_LABEL: Record<string, string> = Object.fromEntries(
    SITUACAO_OCORRENCIA_OPTIONS.map((option) => [option.value, option.label])
)
