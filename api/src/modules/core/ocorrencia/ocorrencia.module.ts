import { Module } from '@nestjs/common'
import { OcorrenciaController } from './ocorrencia.controller'
import OcorrenciaUsecasesModule from './usecases/ocorrencia-usecases.module'

@Module({
    imports: [OcorrenciaUsecasesModule],
    controllers: [OcorrenciaController]
})
export default class OcorrenciaModule {}
