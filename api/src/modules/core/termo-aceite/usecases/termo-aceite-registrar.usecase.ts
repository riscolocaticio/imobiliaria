import { Injectable } from '@nestjs/common'
import prisma from '../../../../infra/persistence/prisma'
import { AuditLogService } from '../../../../infra/audit/audit-log.service'
import { UsuarioFromJwtDto } from '../../usuario/types/usuario-from-jwt.input'

@Injectable()
export class TermoAceiteRegistrarUsecase {
    constructor(private readonly auditLogService: AuditLogService) {}

    async execute(usuarioAtual: UsuarioFromJwtDto, ip: string) {
        const termo = await prisma.termoAceite.upsert({
            where: { usuarioId: usuarioAtual.id },
            create: { usuarioId: usuarioAtual.id, ip },
            update: { aceitoEm: new Date(), ip }
        })

        await this.auditLogService.record({
            usuarioId: usuarioAtual.id,
            imobiliariaId: usuarioAtual.imobiliariaId,
            acao: 'ACEITE_TERMO_USO'
        })

        return termo
    }
}
