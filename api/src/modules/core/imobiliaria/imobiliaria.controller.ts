import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../../infra/system/security/decorators/current-user.decorator'
import { JwtAuthGuard } from '../../../infra/system/security/guards/jwt-auth.guard'
import { MasterGuard } from '../../../infra/system/security/guards/master.guard'
import { UsuarioFromJwtDto } from '../usuario/types/usuario-from-jwt.input'
import { ImobiliariaCreateInput } from './types/imobiliaria-create.input'
import { ImobiliariaUpdateInput } from './types/imobiliaria-update.input'
import { ImobiliariaCreateUsecase } from './usecases/imobiliaria-create.usecase'
import { ImobiliariaFindOwnUsecase } from './usecases/imobiliaria-find-own.usecase'
import { ImobiliariaListAllUsecase } from './usecases/imobiliaria-list-all.usecase'
import { ImobiliariaUpdateUsecase } from './usecases/imobiliaria-update.usecase'

@ApiTags('imobiliaria')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('imobiliarias')
export class ImobiliariaController {
    constructor(
        private readonly imobiliariaFindOwnUsecase: ImobiliariaFindOwnUsecase,
        private readonly imobiliariaListAllUsecase: ImobiliariaListAllUsecase,
        private readonly imobiliariaCreateUsecase: ImobiliariaCreateUsecase,
        private readonly imobiliariaUpdateUsecase: ImobiliariaUpdateUsecase
    ) {}

    @Get('me')
    async me(@CurrentUser() usuario: UsuarioFromJwtDto) {
        return this.imobiliariaFindOwnUsecase.execute(usuario.imobiliariaId)
    }

    @UseGuards(MasterGuard)
    @Get()
    async listar() {
        return this.imobiliariaListAllUsecase.execute()
    }

    @UseGuards(MasterGuard)
    @Post()
    async criar(@CurrentUser() usuario: UsuarioFromJwtDto, @Body() input: ImobiliariaCreateInput) {
        return this.imobiliariaCreateUsecase.execute(usuario, input)
    }

    @UseGuards(MasterGuard)
    @Patch(':id')
    async atualizar(
        @CurrentUser() usuario: UsuarioFromJwtDto,
        @Param('id', ParseIntPipe) id: number,
        @Body() input: ImobiliariaUpdateInput
    ) {
        return this.imobiliariaUpdateUsecase.execute(usuario, id, input)
    }
}
