import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import prisma from '../../../../infra/persistence/prisma'
import { UsuarioFromJwtDto } from '../../usuario/types/usuario-from-jwt.input'

@Injectable()
export class NotificacaoMarcarTodasLidasUsecase {
    async execute(usuarioAtual: UsuarioFromJwtDto) {
        const where: Prisma.NotificacaoWhereInput =
            usuarioAtual.role === 'MASTER'
                ? { destinatario: 'MASTER' }
                : { destinatario: 'IMOBILIARIA', imobiliariaId: usuarioAtual.imobiliariaId }

        await prisma.notificacao.updateMany({ where: { ...where, lida: false }, data: { lida: true } })
    }
}
