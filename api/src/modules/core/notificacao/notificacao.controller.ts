import { Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../../infra/system/security/decorators/current-user.decorator'
import { JwtAuthGuard } from '../../../infra/system/security/guards/jwt-auth.guard'
import { UsuarioFromJwtDto } from '../usuario/types/usuario-from-jwt.input'
import { NotificacaoListarUsecase } from './usecases/notificacao-listar.usecase'
import { NotificacaoMarcarLidaUsecase } from './usecases/notificacao-marcar-lida.usecase'
import { NotificacaoMarcarTodasLidasUsecase } from './usecases/notificacao-marcar-todas-lidas.usecase'

@ApiTags('notificacao')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notificacoes')
export class NotificacaoController {
    constructor(
        private readonly notificacaoListarUsecase: NotificacaoListarUsecase,
        private readonly notificacaoMarcarLidaUsecase: NotificacaoMarcarLidaUsecase,
        private readonly notificacaoMarcarTodasLidasUsecase: NotificacaoMarcarTodasLidasUsecase
    ) {}

    @Get()
    async listar(@CurrentUser() usuario: UsuarioFromJwtDto) {
        return this.notificacaoListarUsecase.execute(usuario)
    }

    @Patch('marcar-todas-lidas')
    async marcarTodasLidas(@CurrentUser() usuario: UsuarioFromJwtDto) {
        await this.notificacaoMarcarTodasLidasUsecase.execute(usuario)
    }

    @Patch(':id/marcar-lida')
    async marcarLida(@CurrentUser() usuario: UsuarioFromJwtDto, @Param('id', ParseIntPipe) id: number) {
        await this.notificacaoMarcarLidaUsecase.execute(usuario, id)
    }
}
