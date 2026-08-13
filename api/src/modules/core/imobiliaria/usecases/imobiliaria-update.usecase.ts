import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import prisma from '../../../../infra/persistence/prisma'
import { AuditLogService } from '../../../../infra/audit/audit-log.service'
import { ImobiliariaUpdateInput } from '../types/imobiliaria-update.input'
import { UsuarioFromJwtDto } from '../../usuario/types/usuario-from-jwt.input'

@Injectable()
export class ImobiliariaUpdateUsecase {
    constructor(private readonly auditLogService: AuditLogService) {}

    async execute(usuarioMaster: UsuarioFromJwtDto, imobiliariaId: number, input: ImobiliariaUpdateInput) {
        const imobiliaria = await prisma.imobiliaria.findUnique({ where: { id: imobiliariaId } })
        if (!imobiliaria) throw new NotFoundException('Imobiliária não encontrada')

        const excluindo = input.status === 'INATIVO' && imobiliaria.status === 'ATIVO'

        if (excluindo) {
            const usuariosVinculados = await prisma.usuario.count({ where: { imobiliariaId } })
            if (usuariosVinculados > 0) {
                const sufixo = usuariosVinculados === 1 ? 'usuário vinculado' : 'usuários vinculados'
                throw new ConflictException(
                    `Não é possível excluir essa imobiliária pois existem ${usuariosVinculados} ${sufixo} a ela.`
                )
            }
        }

        const atualizada = await prisma.imobiliaria.update({
            where: { id: imobiliariaId },
            data: {
                razaoSocial: input.razaoSocial,
                nomeFantasia: input.nomeFantasia,
                email: input.email,
                status: input.status
            },
            select: {
                id: true,
                razaoSocial: true,
                nomeFantasia: true,
                cnpj: true,
                email: true,
                status: true,
                createdAt: true
            }
        })

        await this.auditLogService.record({
            usuarioId: usuarioMaster.id,
            imobiliariaId,
            acao: excluindo ? 'EXCLUSAO_IMOBILIARIA' : 'EDICAO_IMOBILIARIA'
        })

        return atualizada
    }
}
