import { Injectable, UnauthorizedException } from '@nestjs/common'
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

        if (!usuario || usuario.status !== 'ACTIVE') {
            throw new UnauthorizedException('Login ou senha incorretos')
        }

        const senhaValida = await this.cryptoService.compare(password, usuario.passwordHash)
        if (!senhaValida) {
            throw new UnauthorizedException('Login ou senha incorretos')
        }

        const accessToken = this.jwtService.sign({
            id: usuario.id,
            imobiliariaId: usuario.imobiliariaId,
            nomeCompleto: usuario.nomeCompleto,
            email: usuario.email,
            role: usuario.role
        })

        await this.auditLogService.record({
            usuarioId: usuario.id,
            imobiliariaId: usuario.imobiliariaId,
            acao: 'LOGIN'
        })

        return { accessToken }
    }
}
