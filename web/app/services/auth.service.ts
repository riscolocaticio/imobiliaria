import { setCookie, destroyCookie } from 'nookies'
import { apiClient } from './api.service'
import { COOKIE_TOKEN } from '@/shared/enums/cookies.enum'

export interface UsuarioLogado {
    id: number
    imobiliariaId: number
    nomeCompleto: string
    email: string
    role: 'IMOBILIARIA' | 'MASTER'
    papel: 'ADMIN' | 'PADRAO'
    termoAceito: boolean
}

export const authService = {
    async login(login: string, password: string): Promise<void> {
        const { data } = await apiClient.post<{ accessToken: string }>('/auth/login', {
            login,
            password
        })

        setCookie(null, COOKIE_TOKEN.TOKEN, data.accessToken, {
            path: '/',
            maxAge: 60 * 60 * 8
        })
    },

    async me(): Promise<UsuarioLogado> {
        const { data } = await apiClient.get<UsuarioLogado>('/auth/me')
        return data
    },

    async aceitarTermo(): Promise<void> {
        await apiClient.post('/termo-aceite')
    },

    async logout(): Promise<void> {
        try {
            await apiClient.post('/auth/logout')
        } finally {
            destroyCookie(null, COOKIE_TOKEN.TOKEN, { path: '/' })
        }
    },

    limparSessaoLocal(): void {
        destroyCookie(null, COOKIE_TOKEN.TOKEN, { path: '/' })
    }
}
