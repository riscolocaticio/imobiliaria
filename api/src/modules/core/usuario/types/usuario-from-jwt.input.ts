import { PapelUsuario, UsuarioRole } from '@prisma/client'

export class UsuarioFromJwtDto {
    id: number
    imobiliariaId: number
    nomeCompleto: string
    email: string
    role: UsuarioRole
    papel: PapelUsuario
    termoAceito: boolean
}
