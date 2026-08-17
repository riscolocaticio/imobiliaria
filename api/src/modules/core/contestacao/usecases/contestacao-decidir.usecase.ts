import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import prisma from '../../../../infra/persistence/prisma'
import { AuditLogService } from '../../../../infra/audit/audit-log.service'
import { ContestacaoDecidirInput } from '../types/contestacao-decidir.input'
import { UsuarioFromJwtDto } from '../../usuario/types/usuario-from-jwt.input'

@Injectable()
export class ContestacaoDecidirUsecase {
    constructor(private readonly auditLogService: AuditLogService) {}

    async execute(usuarioMaster: UsuarioFromJwtDto, contestacaoId: number, input: ContestacaoDecidirInput) {
        const contestacao = await prisma.contestacao.findUnique({ where: { id: contestacaoId } })
        if (!contestacao) {
            throw new NotFoundException('Contestação não encontrada')
        }

        if (contestacao.status === 'PROCEDENTE' || contestacao.status === 'IMPROCEDENTE') {
            throw new ConflictException('Essa contestação já foi decidida')
        }

        const decidida = await prisma.contestacao.update({
            where: { id: contestacaoId },
            data: {
                status: input.decisao,
                decisaoEm: new Date(),
                decisaoObservacao: input.observacao,
                decididaPorUsuarioId: usuarioMaster.id
            },
            select: { id: true, status: true, decisaoEm: true, decisaoObservacao: true }
        })

        await this.auditLogService.record({
            usuarioId: usuarioMaster.id,
            imobiliariaId: contestacao.imobiliariaId,
            acao: 'DECISAO_CONTESTACAO',
            ocorrenciaId: contestacao.ocorrenciaId
        })

        return decidida
    }
}
