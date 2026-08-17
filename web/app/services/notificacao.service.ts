import { apiClient } from './api.service'

export type TipoNotificacao = 'CONTESTACAO_ABERTA' | 'DOCUMENTO_ENVIADO'

export interface Notificacao {
    id: number
    tipo: TipoNotificacao
    lida: boolean
    createdAt: string
    contestacao: {
        id: number
        ocorrencia: { cpfInquilino: string; nomeInquilinoInformado: string }
        imobiliaria: { nomeFantasia: string | null; razaoSocial: string }
    }
}

export interface NotificacaoListResult {
    notificacoes: Notificacao[]
    naoLidas: number
}

export const notificacaoService = {
    async listar(): Promise<NotificacaoListResult> {
        const { data } = await apiClient.get<NotificacaoListResult>('/notificacoes')
        return data
    },

    async marcarLida(id: number): Promise<void> {
        await apiClient.patch(`/notificacoes/${id}/marcar-lida`)
    },

    async marcarTodasLidas(): Promise<void> {
        await apiClient.patch('/notificacoes/marcar-todas-lidas')
    }
}
