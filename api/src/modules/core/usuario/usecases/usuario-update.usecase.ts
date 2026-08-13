import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import prisma from '../../../../infra/persistence/prisma'
import { CryptoService } from '../../../../infra/system/helpers/crypto/crypto.service'
import { UsuarioUpdateInput } from '../types/usuario-update.input'

@Injectable()
export class UsuarioUpdateUsecase {
    constructor(private readonly cryptoService: CryptoService) {}

    async execute(imobiliariaId: number, usuarioId: number, input: UsuarioUpdateInput) {
        const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } })

        if (!usuario) throw new NotFoundException('Usuário não encontrado')
        if (usuario.imobiliariaId !== imobiliariaId) {
            throw new ForbiddenException('Usuário não pertence à sua imobiliária')
        }

        if (input.status === 'INATIVO' && usuario.status === 'ATIVO') {
            const usuariosAtivos = await prisma.usuario.count({
                where: { imobiliariaId, status: 'ATIVO' }
            })
            if (usuariosAtivos <= 1) {
                throw new ForbiddenException(
                    'Não é possível desativar o único usuário ativo da imobiliária'
                )
            }
        }

        return prisma.usuario.update({
            where: { id: usuarioId },
            data: {
                nomeCompleto: input.nomeCompleto,
                email: input.email,
                status: input.status,
                passwordHash: input.password
                    ? await this.cryptoService.hash(input.password)
                    : undefined
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
    }
}
