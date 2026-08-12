import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import prisma from '../../../../infra/persistence/prisma'
import { AuditLogService } from '../../../../infra/audit/audit-log.service'

@Injectable()
export class OcorrenciaExcluirUsecase {
    constructor(private readonly auditLogService: AuditLogService) {}

    async execute(imobiliariaId: number, usuarioId: number, ocorrenciaId: number) {
        const ocorrencia = await prisma.ocorrencia.findUnique({ where: { id: ocorrenciaId } })

        if (!ocorrencia || ocorrencia.status === 'EXCLUIDA') {
            throw new NotFoundException('Ocorrência não encontrada')
        }

        if (ocorrencia.imobiliariaId !== imobiliariaId) {
            throw new ForbiddenException(
                'Apenas a imobiliária que registrou a ocorrência pode excluí-la'
            )
        }

        await prisma.ocorrencia.update({
            where: { id: ocorrenciaId },
            data: {
                status: 'EXCLUIDA',
                excluidoEm: new Date(),
                excluidoPorUsuarioId: usuarioId
            }
        })

        await this.auditLogService.record({
            usuarioId,
            imobiliariaId,
            acao: 'EXCLUSAO_OCORRENCIA',
            cpfConsultado: ocorrencia.cpfInquilino,
            ocorrenciaId: ocorrencia.id
        })
    }
}
