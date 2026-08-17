import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import prisma from '../../../../infra/persistence/prisma'
import { UsuarioFromJwtDto } from '../../usuario/types/usuario-from-jwt.input'

@Injectable()
export class NotificacaoMarcarLidaUsecase {
    async execute(usuarioAtual: UsuarioFromJwtDto, id: number) {
        const notificacao = await prisma.notificacao.findUnique({ where: { id } })
        if (!notificacao) {
            throw new NotFoundException('Notificação não encontrada')
        }

        const pertenceAoUsuario =
            usuarioAtual.role === 'MASTER'
                ? notificacao.destinatario === 'MASTER'
                : notificacao.destinatario === 'IMOBILIARIA' &&
                  notificacao.imobiliariaId === usuarioAtual.imobiliariaId

        if (!pertenceAoUsuario) {
            throw new ForbiddenException('Você não tem acesso a essa notificação')
        }

        await prisma.notificacao.update({ where: { id }, data: { lida: true } })
    }
}
