import { apiClient } from './api.service'

export const ACAO_LOG_LABEL: Record<string, string> = {
    LOGIN: 'Login',
    CONSULTA_CPF: 'Consulta por CPF',
    INSERCAO_OCORRENCIA: 'Inserção de ocorrência',
    EXCLUSAO_OCORRENCIA: 'Exclusão de ocorrência',
    CRIACAO_IMOBILIARIA: 'Criação de imobiliária',
    EDICAO_IMOBILIARIA: 'Edição de imobiliária',
    EXCLUSAO_IMOBILIARIA: 'Exclusão de imobiliária',
    CRIACAO_USUARIO: 'Criação de usuário',
    EDICAO_USUARIO: 'Edição de usuário',
    EXCLUSAO_USUARIO: 'Exclusão de usuário',
    ABERTURA_CONTESTACAO: 'Abertura de contestação',
    ENVIO_DOCUMENTO_CONTESTACAO: 'Envio de documento',
    DECISAO_CONTESTACAO: 'Decisão de contestação'
}

export function formatarAcaoLog(acao: string): string {
    if (ACAO_LOG_LABEL[acao]) return ACAO_LOG_LABEL[acao]
    const texto = acao.replace(/_/g, ' ').toLowerCase()
    return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export interface LogEntry {
    id: number
    acao: string
    cpfConsultado: string | null
    ocorrenciaId: number | null
    createdAt: string
    usuario: { id: number; nomeCompleto: string; login: string }
    imobiliaria: { id: number; razaoSocial: string; nomeFantasia: string | null }
}

export interface LogListResult {
    logs: LogEntry[]
    total: number
    page: number
    pageSize: number
}

export interface LogFiltros {
    imobiliariaId?: number
    usuarioId?: number
    acao?: string
    de?: string
    ate?: string
    page?: number
    pageSize?: number
}

export const logService = {
    async listar(filtros: LogFiltros): Promise<LogListResult> {
        const { data } = await apiClient.get<LogListResult>('/logs', { params: filtros })
        return data
    }
}
