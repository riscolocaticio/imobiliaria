import { Injectable } from '@nestjs/common'
import { DestinatarioNotificacao, TipoNotificacao } from '@prisma/client'
import prisma from '../persistence/prisma'

interface CriarNotificacaoInput {
    destinatario: DestinatarioNotificacao
    imobiliariaId?: number
    contestacaoId: number
    tipo: TipoNotificacao
}

@Injectable()
export class NotificacaoService {
    async criar(input: CriarNotificacaoInput): Promise<void> {
        await prisma.notificacao.create({ data: input })
    }
}
