'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { parseCookies } from 'nookies'
import { authService, UsuarioLogado } from '../services/auth.service'
import { COOKIE_TOKEN } from '@/shared/enums/cookies.enum'
import { registrarAbaAberta, encerrarAba } from '@/lib/sessao-abas'

interface UserContextValue {
    usuario: UsuarioLogado | null
    carregando: boolean
    recarregar: () => Promise<void>
}

const UserContext = createContext<UserContextValue>({
    usuario: null,
    carregando: true,
    recarregar: async () => {}
})

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [usuario, setUsuario] = useState<UsuarioLogado | null>(null)
    const [carregando, setCarregando] = useState(true)

    const recarregar = useCallback(async () => {
        try {
            const dados = await authService.me()
            setUsuario(dados)
        } catch {
            setUsuario(null)
        }
    }, [])

    useEffect(() => {
        const { appEstavaFechado, abaId } = registrarAbaAberta()
        if (appEstavaFechado) {
            authService.limparSessaoLocal()
        }

        recarregar().finally(() => setCarregando(false))

        function aoFecharAba() {
            const eraUltimaAba = encerrarAba(abaId)
            if (!eraUltimaAba) return

            const token = parseCookies(null)[COOKIE_TOKEN.TOKEN]
            if (!token) return

            fetch(`${process.env.HOST}/auth/logout`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                keepalive: true
            })
        }

        window.addEventListener('pagehide', aoFecharAba)
        return () => window.removeEventListener('pagehide', aoFecharAba)
    }, [recarregar])

    return (
        <UserContext.Provider value={{ usuario, carregando, recarregar }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext)
}
