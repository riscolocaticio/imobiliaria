import { UsuarioRole } from '@prisma/client'

export class UsuarioFromJwtDto {
    id: number
    imobiliariaId: number
    nomeCompleto: string
    email: string
    role: UsuarioRole
    termoAceito: boolean
}
