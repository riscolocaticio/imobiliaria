import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import * as Joi from 'joi'
import { JwtStrategy } from './infra/system/security/decorators/jwt.strategy'
import { AuditLogModule } from './infra/audit/audit-log.module'
import AuthModule from './modules/core/auth/auth.module'
import ImobiliariaModule from './modules/core/imobiliaria/imobiliaria.module'
import UsuarioModule from './modules/core/usuario/usuario.module'
import OcorrenciaModule from './modules/core/ocorrencia/ocorrencia.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
            validationSchema: Joi.object({
                DATABASE_URL: Joi.string().required(),
                PORT: Joi.number().required(),
                JWT_SECRET: Joi.string().required(),
                JWT_EXPIRES_IN: Joi.string().required(),
                URL_FRONT_END: Joi.string().required()
            })
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        AuditLogModule,
        AuthModule,
        ImobiliariaModule,
        UsuarioModule,
        OcorrenciaModule
    ],
    controllers: [],
    providers: [JwtStrategy]
})
export class AppModule {}
