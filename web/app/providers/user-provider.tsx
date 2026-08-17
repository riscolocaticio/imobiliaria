'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authService, UsuarioLogado } from '../services/auth.service'

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
        recarregar().finally(() => setCarregando(false))
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
