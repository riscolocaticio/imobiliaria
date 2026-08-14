import { apiClient } from './api.service'
import { TipoOcorrencia } from '@/shared/constants/tipo-ocorrencia'

export interface ConsultaResult {
    constamInformacoes: boolean
    tipos: TipoOcorrencia[]
}

export interface OcorrenciaDetalhe {
    id: number
    tipo: TipoOcorrencia
    descricao: string
    createdAt: string
    imobiliaria: { nomeFantasia: string | null; razaoSocial: string }
}

export interface OcorrenciaExcluivel {
    id: number
    nomeInquilinoInformado: string
    tipo: TipoOcorrencia
    descricao: string
    createdAt: string
}

export interface OcorrenciaCreateInput {
    nomeInquilinoInformado: string
    cpfInquilino: string
    tipo: TipoOcorrencia
    descricao: string
}

export interface OcorrenciaAdmin {
    id: number
    cpfInquilino: string
    nomeInquilinoInformado: string
    tipo: TipoOcorrencia
    descricao: string
    status: 'ATIVA' | 'EXCLUIDA'
    createdAt: string
    imobiliaria: { id: number; nomeFantasia: string | null; razaoSocial: string }
    usuario: { id: number; nomeCompleto: string; login: string }
}

export interface OcorrenciaAdminListResult {
    ocorrencias: OcorrenciaAdmin[]
    total: number
    page: number
    pageSize: number
}

export interface OcorrenciaAdminFiltros {
    imobiliariaId?: number
    tipo?: TipoOcorrencia
    status?: 'ATIVA' | 'EXCLUIDA'
    cpf?: string
    page?: number
    pageSize?: number
}

export const ocorrenciaService = {
    async consultar(cpf: string): Promise<ConsultaResult> {
        const { data } = await apiClient.get<ConsultaResult>(`/ocorrencias/consulta/${cpf}`)
        return data
    },

    async detalhar(cpf: string): Promise<OcorrenciaDetalhe[]> {
        const { data } = await apiClient.get<OcorrenciaDetalhe[]>(
            `/ocorrencias/consulta/${cpf}/detalhes`
        )
        return data
    },

    async inserir(input: OcorrenciaCreateInput): Promise<void> {
        await apiClient.post('/ocorrencias', input)
    },

    async listarExcluiveis(cpf: string): Promise<OcorrenciaExcluivel[]> {
        const { data } = await apiClient.get<OcorrenciaExcluivel[]>(`/ocorrencias/excluiveis/${cpf}`)
        return data
    },

    async excluir(id: number): Promise<void> {
        await apiClient.delete(`/ocorrencias/${id}`)
    },

    async listarTodasAdmin(filtros: OcorrenciaAdminFiltros): Promise<OcorrenciaAdminListResult> {
        const { data } = await apiClient.get<OcorrenciaAdminListResult>('/ocorrencias/admin', {
            params: filtros
        })
        return data
    }
}
