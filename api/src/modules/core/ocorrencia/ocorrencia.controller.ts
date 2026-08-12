import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../../infra/system/security/decorators/current-user.decorator'
import { JwtAuthGuard } from '../../../infra/system/security/guards/jwt-auth.guard'
import { UsuarioFromJwtDto } from '../usuario/types/usuario-from-jwt.input'
import { OcorrenciaCreateInput } from './types/ocorrencia-create.input'
import { OcorrenciaConsultarPorCpfUsecase } from './usecases/ocorrencia-consultar-por-cpf.usecase'
import { OcorrenciaDetalharPorCpfUsecase } from './usecases/ocorrencia-detalhar-por-cpf.usecase'
import { OcorrenciaExcluirUsecase } from './usecases/ocorrencia-excluir.usecase'
import { OcorrenciaInserirUsecase } from './usecases/ocorrencia-inserir.usecase'
import { OcorrenciaListarExcluiveisUsecase } from './usecases/ocorrencia-listar-excluiveis.usecase'

@ApiTags('ocorrencia')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ocorrencias')
export class OcorrenciaController {
    constructor(
        private readonly ocorrenciaConsultarPorCpfUsecase: OcorrenciaConsultarPorCpfUsecase,
        private readonly ocorrenciaDetalharPorCpfUsecase: OcorrenciaDetalharPorCpfUsecase,
        private readonly ocorrenciaInserirUsecase: OcorrenciaInserirUsecase,
        private readonly ocorrenciaListarExcluiveisUsecase: OcorrenciaListarExcluiveisUsecase,
        private readonly ocorrenciaExcluirUsecase: OcorrenciaExcluirUsecase
    ) {}

    @Get('consulta/:cpf')
    async consultar(@CurrentUser() usuario: UsuarioFromJwtDto, @Param('cpf') cpf: string) {
        return this.ocorrenciaConsultarPorCpfUsecase.execute(cpf, usuario.id, usuario.imobiliariaId)
    }

    @Get('consulta/:cpf/detalhes')
    async detalhar(@Param('cpf') cpf: string) {
        return this.ocorrenciaDetalharPorCpfUsecase.execute(cpf)
    }

    @Post()
    async inserir(@CurrentUser() usuario: UsuarioFromJwtDto, @Body() input: OcorrenciaCreateInput) {
        return this.ocorrenciaInserirUsecase.execute(usuario.imobiliariaId, usuario.id, input)
    }

    @Get('excluiveis/:cpf')
    async listarExcluiveis(@CurrentUser() usuario: UsuarioFromJwtDto, @Param('cpf') cpf: string) {
        return this.ocorrenciaListarExcluiveisUsecase.execute(usuario.imobiliariaId, cpf)
    }

    @Delete(':id')
    async excluir(@CurrentUser() usuario: UsuarioFromJwtDto, @Param('id', ParseIntPipe) id: number) {
        await this.ocorrenciaExcluirUsecase.execute(usuario.imobiliariaId, usuario.id, id)
    }
}
