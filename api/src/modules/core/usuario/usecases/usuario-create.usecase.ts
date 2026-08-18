import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import prisma from '../../../../infra/persistence/prisma'
import { AuditLogService } from '../../../../infra/audit/audit-log.service'
import { CryptoService } from '../../../../infra/system/helpers/crypto/crypto.service'
import { sanitizeCpf } from '../../../../shared/utils/sanitize-cpf'
import { UsuarioCreateInput } from '../types/usuario-create.input'
import { UsuarioFromJwtDto } from '../types/usuario-from-jwt.input'

const MAX_USUARIOS_POR_IMOBILIARIA = 2

@Injectable()
export class UsuarioCreateUsecase {
    constructor(
        private readonly cryptoService: CryptoService,
        private readonly auditLogService: AuditLogService
    ) {}

    async execute(usuarioAtual: UsuarioFromJwtDto, input: UsuarioCreateInput) {
        const imobiliariaId =
            usuarioAtual.role === 'MASTER' && input.imobiliariaId
                ? input.imobiliariaId
                : usuarioAtual.imobiliariaId

        if (usuarioAtual.role === 'MASTER') {
            const imobiliaria = await prisma.imobiliaria.findUnique({ where: { id: imobiliariaId } })
            if (!imobiliaria) throw new NotFoundException('Imobiliária não encontrada')
        }

        const usuariosAtivos = await prisma.usuario.count({
            where: { imobiliariaId, status: 'ATIVO' }
        })

        if (usuariosAtivos >= MAX_USUARIOS_POR_IMOBILIARIA) {
            throw new ConflictException(
                `Cada imobiliária pode ter no máximo ${MAX_USUARIOS_POR_IMOBILIARIA} usuários ativos`
            )
        }

        const cpf = sanitizeCpf(input.cpf)

        const [cpfEmUso, loginEmUso, emailEmUso] = await Promise.all([
            prisma.usuario.findUnique({ where: { cpf } }),
            prisma.usuario.findUnique({ where: { login: input.login } }),
            prisma.usuario.findUnique({ where: { email: input.email } })
        ])

        if (cpfEmUso) throw new ConflictException('CPF já cadastrado')
        if (loginEmUso) throw new ConflictException('Login já está em uso')
        if (emailEmUso) throw new ConflictException('E-mail já está em uso')

        const passwordHash = await this.cryptoService.hash(input.password)

        const usuario = await prisma.usuario.create({
            data: {
                imobiliariaId,
                nomeCompleto: input.nomeCompleto,
                cpf,
                dataNascimento: new Date(input.dataNascimento),
                email: input.email,
                login: input.login,
                passwordHash,
                role: 'IMOBILIARIA'
            },
            select: {
                id: true,
                nomeCompleto: true,
                cpf: true,
                dataNascimento: true,
                email: true,
                login: true,
                role: true,
                status: true,
                createdAt: true
            }
        })

        await this.auditLogService.record({
            usuarioId: usuarioAtual.id,
            imobiliariaId,
            acao: 'CRIACAO_USUARIO'
        })

        return usuario
    }
}
