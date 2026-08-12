import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import AuthUsecasesModule from './usecases/auth-usecases.module'

@Module({
    imports: [AuthUsecasesModule],
    controllers: [AuthController]
})
export default class AuthModule {}
