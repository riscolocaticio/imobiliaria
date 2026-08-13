import { Injectable } from '@nestjs/common'
import { AcaoAuditoria, Prisma } from '@prisma/client'
import prisma from '../../../../infra/persistence/prisma'

export interface LogListFiltros {
    imobiliariaId?: number
    usuarioId?: number
    acao?: AcaoAuditoria
    de?: Date
    ate?: Date
    page: number
    pageSize: number
}

@Injectable()
export class LogListUsecase {
    async execute(filtros: LogListFiltros) {
        const where: Prisma.AuditLogWhereInput = {
            imobiliariaId: filtros.imobiliariaId,
            usuarioId: filtros.usuarioId,
            acao: filtros.acao,
            createdAt:
                filtros.de || filtros.ate
                    ? { gte: filtros.de, lte: filtros.ate }
                    : undefined
        }

        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                select: {
                    id: true,
                    acao: true,
                    cpfConsultado: true,
                    ocorrenciaId: true,
                    createdAt: true,
                    usuario: { select: { id: true, nomeCompleto: true, login: true } },
                    imobiliaria: { select: { id: true, razaoSocial: true, nomeFantasia: true } }
                },
                orderBy: { createdAt: 'desc' },
                skip: (filtros.page - 1) * filtros.pageSize,
                take: filtros.pageSize
            }),
            prisma.auditLog.count({ where })
        ])

        return { logs, total, page: filtros.page, pageSize: filtros.pageSize }
    }
}
