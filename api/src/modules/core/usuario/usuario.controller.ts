import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../../infra/system/security/decorators/current-user.decorator'
import { JwtAuthGuard } from '../../../infra/system/security/guards/jwt-auth.guard'
import { UsuarioFromJwtDto } from './types/usuario-from-jwt.input'
import { UsuarioCreateInput } from './types/usuario-create.input'
import { UsuarioUpdateInput } from './types/usuario-update.input'
import { UsuarioCreateUsecase } from './usecases/usuario-create.usecase'
import { UsuarioListByImobiliariaUsecase } from './usecases/usuario-list-by-imobiliaria.usecase'
import { UsuarioUpdateUsecase } from './usecases/usuario-update.usecase'

@ApiTags('usuario')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuarioController {
    constructor(
        private readonly usuarioCreateUsecase: UsuarioCreateUsecase,
        private readonly usuarioListByImobiliariaUsecase: UsuarioListByImobiliariaUsecase,
        private readonly usuarioUpdateUsecase: UsuarioUpdateUsecase
    ) {}

    @Get()
    async list(@CurrentUser() usuario: UsuarioFromJwtDto) {
        return this.usuarioListByImobiliariaUsecase.execute(usuario.imobiliariaId)
    }

    @Post()
    async create(@CurrentUser() usuario: UsuarioFromJwtDto, @Body() input: UsuarioCreateInput) {
        return this.usuarioCreateUsecase.execute(usuario.imobiliariaId, input)
    }

    @Patch(':id')
    async update(
        @CurrentUser() usuario: UsuarioFromJwtDto,
        @Param('id', ParseIntPipe) id: number,
        @Body() input: UsuarioUpdateInput
    ) {
        return this.usuarioUpdateUsecase.execute(usuario.imobiliariaId, id, input)
    }
}
