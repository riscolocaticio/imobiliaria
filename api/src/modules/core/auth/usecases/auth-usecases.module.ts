import { Module } from '@nestjs/common'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuditLogModule } from '../../../../infra/audit/audit-log.module'
import { CryptoService } from '../../../../infra/system/helpers/crypto/crypto.service'
import { AuthLoginUsecase } from './auth-login.usecase'

@Module({
    imports: [
        AuditLogModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRES_IN')
                } as JwtModuleOptions['signOptions']
            })
        })
    ],
    providers: [AuthLoginUsecase, CryptoService],
    exports: [AuthLoginUsecase]
})
export default class AuthUsecasesModule {}
