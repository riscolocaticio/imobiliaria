import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import prisma from '../../../persistence/prisma'
import { UsuarioFromJwtDto } from '../../../../modules/core/usuario/types/usuario-from-jwt.input'
import { UsuarioPayloadDto } from '../../../../modules/core/usuario/types/usuario-payload.input'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')
        })
    }

    async validate(payload: UsuarioPayloadDto): Promise<UsuarioFromJwtDto> {
        const usuario = await prisma.usuario.findUnique({
            where: { id: payload.id },
            select: { status: true, termoAceite: { select: { id: true } } }
        })

        if (!usuario || usuario.status !== 'ATIVO') {
            throw new UnauthorizedException('Usuário inativo ou não encontrado')
        }

        return {
            id: payload.id,
            imobiliariaId: payload.imobiliariaId,
            nomeCompleto: payload.nomeCompleto,
            email: payload.email,
            role: payload.role,
            papel: payload.papel,
            termoAceito: usuario.termoAceite !== null
        }
    }
}
