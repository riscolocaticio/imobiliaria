import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import prisma from '../../../../infra/persistence/prisma'
import { AuditLogService } from '../../../../infra/audit/audit-log.service'
import { NotificacaoService } from '../../../../infra/notificacao/notificacao.service'
import { addBusinessDays } from '../../../../shared/utils/business-days'
import { ContestacaoAbrirInput } from '../types/contestacao-abrir.input'
import { UsuarioFromJwtDto } from '../../usuario/types/usuario-from-jwt.input'

const DIAS_UTEIS_PARA_RESPOSTA = 3

@Injectable()
export class ContestacaoAbrirUsecase {
    constructor(
        private readonly auditLogService: AuditLogService,
        private readonly notificacaoService: NotificacaoService
    ) {}

    async execute(usuarioMaster: UsuarioFromJwtDto, input: ContestacaoAbrirInput) {
        const ocorrencia = await prisma.ocorrencia.findUnique({ where: { id: input.ocorrenciaId } })

        if (!ocorrencia || ocorrencia.status === 'EXCLUIDA') {
            throw new NotFoundException('Ocorrência não encontrada')
        }

        const contestacaoPendente = await prisma.contestacao.findFirst({
            where: { ocorrenciaId: ocorrencia.id, status: { in: ['ABERTA', 'RESPONDIDA'] } }
        })
        if (contestacaoPendente) {
            throw new ConflictException('Já existe uma contestação em andamento para essa ocorrência')
        }

        const contestacao = await prisma.contestacao.create({
            data: {
                ocorrenciaId: ocorrencia.id,
                imobiliariaId: ocorrencia.imobiliariaId,
                motivoConsumidor: input.motivoConsumidor,
                prazoLimite: addBusinessDays(new Date(), DIAS_UTEIS_PARA_RESPOSTA),
                abertaPorUsuarioId: usuarioMaster.id
            },
            select: {
                id: true,
                ocorrenciaId: true,
                imobiliariaId: true,
                motivoConsumidor: true,
                status: true,
                prazoLimite: true,
                createdAt: true
            }
        })

        await this.auditLogService.record({
            usuarioId: usuarioMaster.id,
            imobiliariaId: ocorrencia.imobiliariaId,
            acao: 'ABERTURA_CONTESTACAO',
            ocorrenciaId: ocorrencia.id
        })

        await this.notificacaoService.criar({
            destinatario: 'IMOBILIARIA',
            imobiliariaId: ocorrencia.imobiliariaId,
            contestacaoId: contestacao.id,
            tipo: 'CONTESTACAO_ABERTA'
        })

        return contestacao
    }
}
