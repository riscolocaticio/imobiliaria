'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from './providers/user-provider'
import { ROUTES } from '@/shared/enums/routes.enum'

export default function HomePage() {
    const { usuario, carregando } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (carregando) return
        router.replace(usuario ? ROUTES.CONSULTAR : ROUTES.LOGIN)
    }, [carregando, usuario, router])

    return null
}
