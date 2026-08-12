import { Injectable } from '@nestjs/common'
import { TipoOcorrencia } from '@prisma/client'
import prisma from '../../../../infra/persistence/prisma'
import { AuditLogService } from '../../../../infra/audit/audit-log.service'
import { sanitizeCpf } from '../../../../shared/utils/sanitize-cpf'

interface ConsultaResult {
    constamInformacoes: boolean
    tipos: TipoOcorrencia[]
}

@Injectable()
export class OcorrenciaConsultarPorCpfUsecase {
    constructor(private readonly auditLogService: AuditLogService) {}

    async execute(cpfInput: string, usuarioId: number, imobiliariaId: number): Promise<ConsultaResult> {
        const cpf = sanitizeCpf(cpfInput)

        const ocorrencias = await prisma.ocorrencia.findMany({
            where: { cpfInquilino: cpf, status: 'ATIVA' },
            select: { tipo: true }
        })

        await this.auditLogService.record({
            usuarioId,
            imobiliariaId,
            acao: 'CONSULTA_CPF',
            cpfConsultado: cpf
        })

        return {
            constamInformacoes: ocorrencias.length > 0,
            tipos: [...new Set(ocorrencias.map((o) => o.tipo))]
        }
    }
}
