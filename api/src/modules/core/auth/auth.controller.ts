import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { CurrentUser } from '../../../infra/system/security/decorators/current-user.decorator'
import { JwtAuthGuard } from '../../../infra/system/security/guards/jwt-auth.guard'
import { UsuarioFromJwtDto } from '../usuario/types/usuario-from-jwt.input'
import { AuthLoginInput } from './types/auth-login.input'
import { AuthLoginUsecase } from './usecases/auth-login.usecase'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authLoginUsecase: AuthLoginUsecase) {}

    @Throttle({ default: { limit: 5, ttl: 60_000 } })
    @Post('login')
    async login(@Body() input: AuthLoginInput) {
        return this.authLoginUsecase.execute(input.login, input.password)
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@CurrentUser() usuario: UsuarioFromJwtDto) {
        return usuario
    }
}
