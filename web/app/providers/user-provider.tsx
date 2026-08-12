'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { authService, UsuarioLogado } from '../services/auth.service'

interface UserContextValue {
    usuario: UsuarioLogado | null
    carregando: boolean
}

const UserContext = createContext<UserContextValue>({ usuario: null, carregando: true })

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [usuario, setUsuario] = useState<UsuarioLogado | null>(null)
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        authService
            .me()
            .then(setUsuario)
            .catch(() => setUsuario(null))
            .finally(() => setCarregando(false))
    }, [])

    return (
        <UserContext.Provider value={{ usuario, carregando }}>{children}</UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext)
}
