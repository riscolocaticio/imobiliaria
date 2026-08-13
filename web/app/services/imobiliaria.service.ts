import { apiClient } from './api.service'

export interface Imobiliaria {
    id: number
    razaoSocial: string
    nomeFantasia: string | null
    cnpj: string
    email: string
    status: 'ATIVO' | 'INATIVO'
    createdAt: string
}

export interface ImobiliariaComContagem extends Imobiliaria {
    _count: { usuarios: number }
}

export interface ImobiliariaCreateInput {
    razaoSocial: string
    nomeFantasia?: string
    cnpj: string
    email: string
}

export interface ImobiliariaUpdateInput {
    razaoSocial?: string
    nomeFantasia?: string
    email?: string
    status?: 'ATIVO' | 'INATIVO'
}

export const imobiliariaService = {
    async me(): Promise<Imobiliaria> {
        const { data } = await apiClient.get<Imobiliaria>('/imobiliarias/me')
        return data
    },

    async listar(): Promise<ImobiliariaComContagem[]> {
        const { data } = await apiClient.get<ImobiliariaComContagem[]>('/imobiliarias')
        return data
    },

    async criar(input: ImobiliariaCreateInput): Promise<Imobiliaria> {
        const { data } = await apiClient.post<Imobiliaria>('/imobiliarias', input)
        return data
    },

    async atualizar(id: number, input: ImobiliariaUpdateInput): Promise<Imobiliaria> {
        const { data } = await apiClient.patch<Imobiliaria>(`/imobiliarias/${id}`, input)
        return data
    }
}
