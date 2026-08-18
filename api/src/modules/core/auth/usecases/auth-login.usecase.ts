import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import prisma from '../../../../infra/persistence/prisma'
import { CryptoService } from '../../../../infra/system/helpers/crypto/crypto.service'
import { AuditLogService } from '../../../../infra/audit/audit-log.service'

@Injectable()
export class AuthLoginUsecase {
    constructor(
        private readonly jwtService: JwtService,
        private readonly cryptoService: CryptoService,
        private readonly auditLogService: AuditLogService
    ) {}

    async execute(login: string, password: string): Promise<{ accessToken: string }> {
        const usuario = await prisma.usuario.findUnique({ where: { login } })

        if (!usuario) {
            throw new UnauthorizedException('Login ou senha incorretos')
        }

        const senhaValida = await this.cryptoService.compare(password, usuario.passwordHash)
        if (!senhaValida) {
            throw new UnauthorizedException('Login ou senha incorretos')
        }

        if (usuario.status !== 'ATIVO') {
            throw new UnauthorizedException('Usuário inativo. Não é possível acessar o sistema.')
        }

        if (usuario.sessaoExpiraEm && usuario.sessaoExpiraEm > new Date()) {
            throw new ConflictException(
                'Já existe um login ativo com este usuário. Encerre a sessão atual antes de continuar.'
            )
        }

        const accessToken = this.jwtService.sign({
            id: usuario.id,
            imobiliariaId: usuario.imobiliariaId,
            nomeCompleto: usuario.nomeCompleto,
            email: usuario.email,
            role: usuario.role
        })

        const { exp } = this.jwtService.decode<{ exp: number }>(accessToken)

        await prisma.usuario.update({
            where: { id: usuario.id },
            data: { sessaoExpiraEm: new Date(exp * 1000) }
        })

        await this.auditLogService.record({
            usuarioId: usuario.id,
            imobiliariaId: usuario.imobiliariaId,
            acao: 'LOGIN'
        })

        return { accessToken }
    }
}
