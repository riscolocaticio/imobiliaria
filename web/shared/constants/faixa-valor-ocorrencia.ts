export const FAIXA_VALOR_OCORRENCIA_OPTIONS = [
    { value: 'ATE_5_MIL', label: 'Até R$ 5.000' },
    { value: 'DE_5_MIL_A_20_MIL', label: 'De R$ 5.001 a R$ 20.000' },
    { value: 'ACIMA_20_MIL', label: 'Acima de R$ 20.000' }
] as const

export type FaixaValorOcorrencia = (typeof FAIXA_VALOR_OCORRENCIA_OPTIONS)[number]['value']

export const FAIXA_VALOR_OCORRENCIA_LABEL: Record<string, string> = Object.fromEntries(
    FAIXA_VALOR_OCORRENCIA_OPTIONS.map((option) => [option.value, option.label])
)
