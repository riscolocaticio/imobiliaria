import { ConflictException, Injectable } from '@nestjs/common'
import prisma from '../../../../infra/persistence/prisma'
import { CryptoService } from '../../../../infra/system/helpers/crypto/crypto.service'
import { sanitizeCpf } from '../../../../shared/utils/sanitize-cpf'
import { UsuarioCreateInput } from '../types/usuario-create.input'

const MAX_USUARIOS_POR_IMOBILIARIA = 2

@Injectable()
export class UsuarioCreateUsecase {
    constructor(private readonly cryptoService: CryptoService) {}

    async execute(imobiliariaId: number, input: UsuarioCreateInput) {
        const usuariosAtivos = await prisma.usuario.count({
            where: { imobiliariaId, status: 'ATIVO' }
        })

        if (usuariosAtivos >= MAX_USUARIOS_POR_IMOBILIARIA) {
            throw new ConflictException(
                `Cada imobiliária pode ter no máximo ${MAX_USUARIOS_POR_IMOBILIARIA} usuários ativos`
            )
        }

        const cpf = sanitizeCpf(input.cpf)

        const [cpfEmUso, loginEmUso] = await Promise.all([
            prisma.usuario.findUnique({ where: { cpf } }),
            prisma.usuario.findUnique({ where: { login: input.login } })
        ])

        if (cpfEmUso) throw new ConflictException('CPF já cadastrado')
        if (loginEmUso) throw new ConflictException('Login já está em uso')

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

        return usuario
    }
}
