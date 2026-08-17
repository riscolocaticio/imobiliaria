import { Controller, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { CurrentUser } from '../../../infra/system/security/decorators/current-user.decorator'
import { JwtAuthGuard } from '../../../infra/system/security/guards/jwt-auth.guard'
import { UsuarioFromJwtDto } from '../usuario/types/usuario-from-jwt.input'
import { TermoAceiteRegistrarUsecase } from './usecases/termo-aceite-registrar.usecase'

@ApiTags('termo-aceite')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('termo-aceite')
export class TermoAceiteController {
    constructor(private readonly termoAceiteRegistrarUsecase: TermoAceiteRegistrarUsecase) {}

    @Post()
    async aceitar(@CurrentUser() usuario: UsuarioFromJwtDto, @Req() request: Request) {
        const ip = request.ip ?? request.socket.remoteAddress ?? 'desconhecido'
        return this.termoAceiteRegistrarUsecase.execute(usuario, ip)
    }
}
