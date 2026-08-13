import { apiClient } from './api.service'

export interface Usuario {
    id: number
    imobiliariaId?: number
    nomeCompleto: string
    cpf: string
    dataNascimento: string
    email: string
    login: string
    role: 'IMOBILIARIA' | 'MASTER'
    status: 'ATIVO' | 'INATIVO'
    createdAt: string
    imobiliaria?: { id: number; razaoSocial: string; nomeFantasia: string | null }
}

export interface UsuarioCreateInput {
    nomeCompleto: string
    cpf: string
    dataNascimento: string
    email: string
    login: string
    password: string
    imobiliariaId?: number
}

export const usuarioService = {
    async listar(imobiliariaId?: number): Promise<Usuario[]> {
        const { data } = await apiClient.get<Usuario[]>('/usuarios', {
            params: imobiliariaId ? { imobiliariaId } : undefined
        })
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
