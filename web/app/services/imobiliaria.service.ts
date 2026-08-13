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

export const imobiliariaService = {
    async me(): Promise<Imobiliaria> {
        const { data } = await apiClient.get<Imobiliaria>('/imobiliarias/me')
        return data
    }
}
