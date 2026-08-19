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

        if (input.email && input.email !== usuario.email) {
            const emailEmUso = await prisma.usuario.findUnique({ where: { email: input.email } })
            if (emailEmUso) throw new ConflictException('E-mail já está em uso')
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
        const novoPapel = input.papel ?? usuario.papel

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

        const deixaDeSerAdminAtivoAli =
            usuario.role === 'IMOBILIARIA' &&
            usuario.papel === 'ADMIN' &&
            usuario.status === 'ATIVO' &&
            (mudouDeImobiliaria || novoStatus !== 'ATIVO' || novoPapel !== 'ADMIN')

        if (deixaDeSerAdminAtivoAli) {
            const outrosAdminsAtivos = await prisma.usuario.count({
                where: {
                    imobiliariaId: usuario.imobiliariaId,
                    status: 'ATIVO',
                    papel: 'ADMIN',
                    id: { not: usuarioId }
                }
            })
            if (outrosAdminsAtivos === 0) {
                throw new ForbiddenException(
                    'A imobiliária precisa ter ao menos um usuário Administrador ativo'
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
                papel: input.papel,
                sessaoExpiraEm: input.status === 'INATIVO' ? null : undefined,
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
                papel: true,
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
