import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../../infra/system/security/decorators/current-user.decorator'
import { JwtAuthGuard } from '../../../infra/system/security/guards/jwt-auth.guard'
import { UsuarioFromJwtDto } from '../usuario/types/usuario-from-jwt.input'
import { ImobiliariaFindOwnUsecase } from './usecases/imobiliaria-find-own.usecase'

@ApiTags('imobiliaria')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('imobiliarias')
export class ImobiliariaController {
    constructor(private readonly imobiliariaFindOwnUsecase: ImobiliariaFindOwnUsecase) {}

    @Get('me')
    async me(@CurrentUser() usuario: UsuarioFromJwtDto) {
        return this.imobiliariaFindOwnUsecase.execute(usuario.imobiliariaId)
    }
}
