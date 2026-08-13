import { apiClient } from './api.service'

export interface Usuario {
    id: number
    nomeCompleto: string
    cpf: string
    dataNascimento: string
    email: string
    login: string
    role: 'IMOBILIARIA' | 'MASTER'
    status: 'ATIVO' | 'INATIVO'
    createdAt: string
}

export interface UsuarioCreateInput {
    nomeCompleto: string
    cpf: string
    dataNascimento: string
    email: string
    login: string
    password: string
}

export const usuarioService = {
    async listar(): Promise<Usuario[]> {
        const { data } = await apiClient.get<Usuario[]>('/usuarios')
        return data
    },

    async criar(input: UsuarioCreateInput): Promise<Usuario> {
        const { data } = await apiClient.post<Usuario>('/usuarios', input)
        return data
    },

    async atualizarStatus(id: number, status: 'ATIVO' | 'INATIVO'): Promise<Usuario> {
        const { data } = await apiClient.patch<Usuario>(`/usuarios/${id}`, { status })
        return data
    }
}
