import { PapelUsuario, UsuarioRole } from '@prisma/client'

export class UsuarioPayloadDto {
    id: number
    imobiliariaId: number
    nomeCompleto: string
    email: string
    role: UsuarioRole
    papel: PapelUsuario
}
