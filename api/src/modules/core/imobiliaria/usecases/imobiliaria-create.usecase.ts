import { ConflictException, Injectable } from '@nestjs/common'
import prisma from '../../../../infra/persistence/prisma'
import { AuditLogService } from '../../../../infra/audit/audit-log.service'
import { sanitizeCnpj } from '../../../../shared/utils/sanitize-cnpj'
import { ImobiliariaCreateInput } from '../types/imobiliaria-create.input'
import { UsuarioFromJwtDto } from '../../usuario/types/usuario-from-jwt.input'

@Injectable()
export class ImobiliariaCreateUsecase {
    constructor(private readonly auditLogService: AuditLogService) {}

    async execute(usuarioMaster: UsuarioFromJwtDto, input: ImobiliariaCreateInput) {
        const cnpj = sanitizeCnpj(input.cnpj)

        const cnpjEmUso = await prisma.imobiliaria.findUnique({ where: { cnpj } })
        if (cnpjEmUso) throw new ConflictException('CNPJ já cadastrado')

        const imobiliaria = await prisma.imobiliaria.create({
            data: {
                razaoSocial: input.razaoSocial,
                nomeFantasia: input.nomeFantasia,
                cnpj,
                email: input.email
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
            imobiliariaId: imobiliaria.id,
            acao: 'CRIACAO_IMOBILIARIA'
        })

        return imobiliaria
    }
}
