import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import prisma from '../../../../infra/persistence/prisma'
import { UsuarioFromJwtDto } from '../../usuario/types/usuario-from-jwt.input'

const QUANTIDADE_MAXIMA = 30

@Injectable()
export class NotificacaoListarUsecase {
    async execute(usuarioAtual: UsuarioFromJwtDto) {
        const where: Prisma.NotificacaoWhereInput =
            usuarioAtual.role === 'MASTER'
                ? { destinatario: 'MASTER' }
                : { destinatario: 'IMOBILIARIA', imobiliariaId: usuarioAtual.imobiliariaId }

        const [notificacoes, naoLidas] = await Promise.all([
            prisma.notificacao.findMany({
                where,
                select: {
                    id: true,
                    tipo: true,
                    lida: true,
                    createdAt: true,
                    contestacao: {
                        select: {
                            id: true,
                            ocorrencia: { select: { cpfInquilino: true, nomeInquilinoInformado: true } },
                            imobiliaria: { select: { nomeFantasia: true, razaoSocial: true } }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: QUANTIDADE_MAXIMA
            }),
            prisma.notificacao.count({ where: { ...where, lida: false } })
        ])

        return { notificacoes, naoLidas }
    }
}
