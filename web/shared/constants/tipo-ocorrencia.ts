export const TIPO_OCORRENCIA_OPTIONS = [
    { value: 'ABANDONO_IMOVEL', label: 'Abandono do imóvel' },
    { value: 'INADIMPLENCIA_LOCATICIA', label: 'Inadimplência locatícia' },
    { value: 'DEPREDACAO_DANOS_IMOVEL', label: 'Depredação / danos ao imóvel' },
    { value: 'MULTA_CONTRATUAL', label: 'Multa contratual' },
    { value: 'DESCUMPRIMENTO_CONTRATUAL', label: 'Descumprimento contratual' },
    { value: 'OUTROS', label: 'Outros' }
] as const

export type TipoOcorrencia = (typeof TIPO_OCORRENCIA_OPTIONS)[number]['value']

export const TIPO_OCORRENCIA_LABEL: Record<string, string> = Object.fromEntries(
    TIPO_OCORRENCIA_OPTIONS.map((option) => [option.value, option.label])
)
