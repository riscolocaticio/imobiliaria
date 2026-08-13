import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AcaoAuditoria } from '@prisma/client'
import { JwtAuthGuard } from '../../../infra/system/security/guards/jwt-auth.guard'
import { MasterGuard } from '../../../infra/system/security/guards/master.guard'
import { LogListUsecase } from './usecases/log-list.usecase'

@ApiTags('log')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MasterGuard)
@Controller('logs')
export class LogController {
    constructor(private readonly logListUsecase: LogListUsecase) {}

    @Get()
    async list(
        @Query('imobiliariaId') imobiliariaId?: string,
        @Query('usuarioId') usuarioId?: string,
        @Query('acao') acao?: AcaoAuditoria,
        @Query('de') de?: string,
        @Query('ate') ate?: string,
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string
    ) {
        return this.logListUsecase.execute({
            imobiliariaId: imobiliariaId ? Number(imobiliariaId) : undefined,
            usuarioId: usuarioId ? Number(usuarioId) : undefined,
            acao,
            de: de ? new Date(de) : undefined,
            ate: ate ? new Date(ate) : undefined,
            page: page ? Number(page) : 1,
            pageSize: pageSize ? Number(pageSize) : 50
        })
    }
}
