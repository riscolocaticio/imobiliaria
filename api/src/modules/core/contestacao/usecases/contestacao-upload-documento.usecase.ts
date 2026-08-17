import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import prisma from '../../../../infra/persistence/prisma'
import { AuditLogService } from '../../../../infra/audit/audit-log.service'
import { NotificacaoService } from '../../../../infra/notificacao/notificacao.service'
import { calcularStatusEfetivo } from '../utils/calcular-status-efetivo'
import { UsuarioFromJwtDto } from '../../usuario/types/usuario-from-jwt.input'

@Injectable()
export class ContestacaoUploadDocumentoUsecase {
    constructor(
        private readonly auditLogService: AuditLogService,
        private readonly notificacaoService: NotificacaoService
    ) {}

    async execute(usuarioAtual: UsuarioFromJwtDto, contestacaoId: number, arquivo: Express.Multer.File) {
        const contestacao = await prisma.contestacao.findUnique({ where: { id: contestacaoId } })
        if (!contestacao) {
            throw new NotFoundException('Contestação não encontrada')
        }

        const podeEnviar =
            usuarioAtual.role === 'MASTER' || contestacao.imobiliariaId === usuarioAtual.imobiliariaId
        if (!podeEnviar) {
            throw new ForbiddenException('Você não tem acesso a essa contestação')
        }

        const statusEfetivo = calcularStatusEfetivo(contestacao)
        if (statusEfetivo !== 'ABERTA' && statusEfetivo !== 'RESPONDIDA') {
            throw new ForbiddenException('Essa contestação não aceita mais o envio de documentos')
        }

        const documento = await prisma.contestacaoDocumento.create({
            data: {
                contestacaoId,
                nomeArquivo: arquivo.originalname,
                caminhoArquivo: arquivo.path,
                tamanhoBytes: arquivo.size,
                mimeType: arquivo.mimetype,
                enviadoPorUsuarioId: usuarioAtual.id
            },
            select: { id: true, nomeArquivo: true, tamanhoBytes: true, mimeType: true, createdAt: true }
        })

        const enviadoPelaImobiliaria = usuarioAtual.role !== 'MASTER'

        if (enviadoPelaImobiliaria && contestacao.status === 'ABERTA') {
            await prisma.contestacao.update({
                where: { id: contestacaoId },
                data: { status: 'RESPONDIDA', respondidaEm: new Date() }
            })
        }

        await this.auditLogService.record({
            usuarioId: usuarioAtual.id,
            imobiliariaId: contestacao.imobiliariaId,
            acao: 'ENVIO_DOCUMENTO_CONTESTACAO',
            ocorrenciaId: contestacao.ocorrenciaId
        })

        if (enviadoPelaImobiliaria) {
            await this.notificacaoService.criar({
                destinatario: 'MASTER',
                contestacaoId: contestacao.id,
                tipo: 'DOCUMENTO_ENVIADO'
            })
        }

        return documento
    }
}
