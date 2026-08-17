import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import prisma from '../../../../infra/persistence/prisma'
import { UsuarioFromJwtDto } from '../../usuario/types/usuario-from-jwt.input'

@Injectable()
export class ContestacaoDownloadDocumentoUsecase {
    async execute(usuarioAtual: UsuarioFromJwtDto, contestacaoId: number, documentoId: number) {
        const documento = await prisma.contestacaoDocumento.findUnique({
            where: { id: documentoId },
            include: { contestacao: true }
        })

        if (!documento || documento.contestacaoId !== contestacaoId) {
            throw new NotFoundException('Documento não encontrado')
        }

        if (usuarioAtual.role !== 'MASTER' && documento.contestacao.imobiliariaId !== usuarioAtual.imobiliariaId) {
            throw new ForbiddenException('Você não tem acesso a esse documento')
        }

        return documento
    }
}
