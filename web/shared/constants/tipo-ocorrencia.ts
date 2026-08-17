import {
    Ban,
    CircleHelp,
    ClipboardX,
    DoorOpen,
    FileWarning,
    Gavel,
    Scale,
    ShieldAlert,
    Wallet,
    type LucideIcon
} from 'lucide-react'

export const TIPO_OCORRENCIA_OPTIONS = [
    { value: 'ABANDONO_IMOVEL', label: 'Abandono de imóvel' },
    { value: 'DEBITO_LOCATICIO_ABERTO', label: 'Débito locatício em aberto' },
    { value: 'MULTA_RESCISORIA_NAO_QUITADA', label: 'Multa rescisória não quitada' },
    { value: 'DANOS_IMOVEL', label: 'Danos ao imóvel' },
    { value: 'DESCUMPRIMENTO_CONTRATUAL', label: 'Descumprimento contratual' },
    { value: 'ENTREGA_IRREGULAR_IMOVEL', label: 'Entrega irregular do imóvel' },
    { value: 'UTILIZACAO_INDEVIDA_IMOVEL', label: 'Utilização indevida do imóvel' },
    { value: 'ACAO_JUDICIAL_LOCACAO', label: 'Ação judicial relacionada à locação' },
    { value: 'OUTROS', label: 'Outro' }
] as const

export type TipoOcorrencia = (typeof TIPO_OCORRENCIA_OPTIONS)[number]['value']

export const TIPO_OCORRENCIA_LABEL: Record<string, string> = Object.fromEntries(
    TIPO_OCORRENCIA_OPTIONS.map((option) => [option.value, option.label])
)

export const TIPO_OCORRENCIA_ICON: Record<string, LucideIcon> = {
    ABANDONO_IMOVEL: DoorOpen,
    DEBITO_LOCATICIO_ABERTO: Wallet,
    MULTA_RESCISORIA_NAO_QUITADA: Gavel,
    DANOS_IMOVEL: ShieldAlert,
    DESCUMPRIMENTO_CONTRATUAL: FileWarning,
    ENTREGA_IRREGULAR_IMOVEL: ClipboardX,
    UTILIZACAO_INDEVIDA_IMOVEL: Ban,
    ACAO_JUDICIAL_LOCACAO: Scale,
    OUTROS: CircleHelp
}
