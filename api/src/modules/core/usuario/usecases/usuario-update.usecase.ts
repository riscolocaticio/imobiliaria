import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import prisma from '../../../../infra/persistence/prisma'
import { AuditLogService } from '../../../../infra/audit/audit-log.service'
import { CryptoService } from '../../../../infra/system/helpers/crypto/crypto.service'
import { UsuarioUpdateInput } from '../types/usuario-update.input'
import { UsuarioFromJwtDto } from '../types/usuario-from-jwt.input'

const MAX_USUARIOS_ATIVOS_POR_IMOBILIARIA = 2

@Injectable()
export class UsuarioUpdateUsecase {
    constructor(
        private readonly cryptoService: CryptoService,
        private readonly auditLogService: AuditLogService
    ) {}

    async execute(usuarioAtual: UsuarioFromJwtDto, usuarioId: number, input: UsuarioUpdateInput) {
        const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } })

        if (!usuario) throw new NotFoundException('Usuário não encontrado')
        if (usuarioAtual.role !== 'MASTER' && usuario.imobiliariaId !== usuarioAtual.imobiliariaId) {
            throw new ForbiddenException('Usuário não pertence à sua imobiliária')
        }

        const novaImobiliariaId =
            usuarioAtual.role === 'MASTER' && input.imobiliariaId
                ? input.imobiliariaId
                : usuario.imobiliariaId
        const mudouDeImobiliaria = novaImobiliariaId !== usuario.imobiliariaId

        if (mudouDeImobiliaria) {
            const imobiliariaDestino = await prisma.imobiliaria.findUnique({
                where: { id: novaImobiliariaId }
            })
            if (!imobiliariaDestino) throw new NotFoundException('Imobiliária não encontrada')
        }

        const novoStatus = input.status ?? usuario.status

        if (input.status === 'INATIVO' && usuario.status === 'ATIVO' && !mudouDeImobiliaria) {
            const usuariosAtivos = await prisma.usuario.count({
                where: { imobiliariaId: usuario.imobiliariaId, status: 'ATIVO' }
            })
            if (usuariosAtivos <= 1) {
                throw new ForbiddenException(
                    'Não é possível desativar o único usuário ativo da imobiliária'
                )
            }
        }

        const passaAContarComoAtivoAli = novoStatus === 'ATIVO' && (mudouDeImobiliaria || usuario.status === 'INATIVO')

        if (passaAContarComoAtivoAli) {
            const usuariosAtivos = await prisma.usuario.count({
                where: { imobiliariaId: novaImobiliariaId, status: 'ATIVO' }
            })
            if (usuariosAtivos >= MAX_USUARIOS_ATIVOS_POR_IMOBILIARIA) {
                throw new ConflictException(
                    `Essa imobiliária já tem o máximo de ${MAX_USUARIOS_ATIVOS_POR_IMOBILIARIA} usuários ativos`
                )
            }
        }

        const atualizado = await prisma.usuario.update({
            where: { id: usuarioId },
            data: {
                imobiliariaId: novaImobiliariaId,
                nomeCompleto: input.nomeCompleto,
                email: input.email,
                status: input.status,
                passwordHash: input.password
                    ? await this.cryptoService.hash(input.password)
                    : undefined
            },
            select: {
                id: true,
                imobiliariaId: true,
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

        const excluindo = input.status === 'INATIVO' && usuario.status === 'ATIVO'

        await this.auditLogService.record({
            usuarioId: usuarioAtual.id,
            imobiliariaId: novaImobiliariaId,
            acao: excluindo ? 'EXCLUSAO_USUARIO' : 'EDICAO_USUARIO'
        })

        return atualizado
    }
}
