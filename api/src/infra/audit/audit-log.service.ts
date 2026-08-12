import { Injectable } from '@nestjs/common'
import { AcaoAuditoria } from '@prisma/client'
import prisma from '../persistence/prisma'

interface RecordAuditLogInput {
    usuarioId: number
    imobiliariaId: number
    acao: AcaoAuditoria
    cpfConsultado?: string
    ocorrenciaId?: number
}

@Injectable()
export class AuditLogService {
    async record(input: RecordAuditLogInput): Promise<void> {
        await prisma.auditLog.create({
            data: {
                usuarioId: input.usuarioId,
                imobiliariaId: input.imobiliariaId,
                acao: input.acao,
                cpfConsultado: input.cpfConsultado,
                ocorrenciaId: input.ocorrenciaId
            }
        })
    }
}
