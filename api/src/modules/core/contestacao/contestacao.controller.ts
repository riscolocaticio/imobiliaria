import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Res,
    StreamableFile,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { createReadStream } from 'fs'
import { Response } from 'express'
import { CurrentUser } from '../../../infra/system/security/decorators/current-user.decorator'
import { JwtAuthGuard } from '../../../infra/system/security/guards/jwt-auth.guard'
import { MasterGuard } from '../../../infra/system/security/guards/master.guard'
import { UsuarioFromJwtDto } from '../usuario/types/usuario-from-jwt.input'
import { contestacaoUploadOptions } from './config/contestacao-upload.config'
import { ContestacaoAbrirInput } from './types/contestacao-abrir.input'
import { ContestacaoDecidirInput } from './types/contestacao-decidir.input'
import { ContestacaoAbrirUsecase } from './usecases/contestacao-abrir.usecase'
import { ContestacaoListarUsecase, ContestacaoListarFiltros } from './usecases/contestacao-listar.usecase'
import { ContestacaoDetalharUsecase } from './usecases/contestacao-detalhar.usecase'
import { ContestacaoUploadDocumentoUsecase } from './usecases/contestacao-upload-documento.usecase'
import { ContestacaoDownloadDocumentoUsecase } from './usecases/contestacao-download-documento.usecase'
import { ContestacaoDecidirUsecase } from './usecases/contestacao-decidir.usecase'

@ApiTags('contestacao')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contestacoes')
export class ContestacaoController {
    constructor(
        private readonly contestacaoAbrirUsecase: ContestacaoAbrirUsecase,
        private readonly contestacaoListarUsecase: ContestacaoListarUsecase,
        private readonly contestacaoDetalharUsecase: ContestacaoDetalharUsecase,
        private readonly contestacaoUploadDocumentoUsecase: ContestacaoUploadDocumentoUsecase,
        private readonly contestacaoDownloadDocumentoUsecase: ContestacaoDownloadDocumentoUsecase,
        private readonly contestacaoDecidirUsecase: ContestacaoDecidirUsecase
    ) {}

    @UseGuards(MasterGuard)
    @Post()
    async abrir(@CurrentUser() usuario: UsuarioFromJwtDto, @Body() input: ContestacaoAbrirInput) {
        return this.contestacaoAbrirUsecase.execute(usuario, input)
    }

    @Get()
    async listar(
        @CurrentUser() usuario: UsuarioFromJwtDto,
        @Query('imobiliariaId') imobiliariaId?: string,
        @Query('status') status?: ContestacaoListarFiltros['status'],
        @Query('cpf') cpf?: string,
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string
    ) {
        const imobiliariaIdFiltro =
            usuario.role === 'MASTER' ? (imobiliariaId ? Number(imobiliariaId) : undefined) : usuario.imobiliariaId

        return this.contestacaoListarUsecase.execute({
            imobiliariaId: imobiliariaIdFiltro,
            status,
            cpf,
            page: page ? Number(page) : 1,
            pageSize: pageSize ? Number(pageSize) : 50
        })
    }

    @Get(':id')
    async detalhar(@CurrentUser() usuario: UsuarioFromJwtDto, @Param('id', ParseIntPipe) id: number) {
        return this.contestacaoDetalharUsecase.execute(usuario, id)
    }

    @Post(':id/documentos')
    @UseInterceptors(FileInterceptor('arquivo', contestacaoUploadOptions))
    async enviarDocumento(
        @CurrentUser() usuario: UsuarioFromJwtDto,
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() arquivo: Express.Multer.File
    ) {
        return this.contestacaoUploadDocumentoUsecase.execute(usuario, id, arquivo)
    }

    @Get(':id/documentos/:documentoId')
    async baixarDocumento(
        @CurrentUser() usuario: UsuarioFromJwtDto,
        @Param('id', ParseIntPipe) id: number,
        @Param('documentoId', ParseIntPipe) documentoId: number,
        @Res({ passthrough: true }) res: Response
    ) {
        const documento = await this.contestacaoDownloadDocumentoUsecase.execute(usuario, id, documentoId)

        res.set({
            'Content-Type': documento.mimeType,
            'Content-Disposition': `attachment; filename="${encodeURIComponent(documento.nomeArquivo)}"`
        })

        return new StreamableFile(createReadStream(documento.caminhoArquivo))
    }

    @UseGuards(MasterGuard)
    @Patch(':id/decisao')
    async decidir(
        @CurrentUser() usuario: UsuarioFromJwtDto,
        @Param('id', ParseIntPipe) id: number,
        @Body() input: ContestacaoDecidirInput
    ) {
        return this.contestacaoDecidirUsecase.execute(usuario, id, input)
    }
}
