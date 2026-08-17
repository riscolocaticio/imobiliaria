import { Module } from '@nestjs/common'
import { ContestacaoController } from './contestacao.controller'
import ContestacaoUsecasesModule from './usecases/contestacao-usecases.module'

@Module({
    imports: [ContestacaoUsecasesModule],
    controllers: [ContestacaoController]
})
export default class ContestacaoModule {}
